# FotoDej CMS

A photography studio web application built with Angular. It combines a **public website** for the studio, a **client area** where customers view their photo albums and pick their favourite photos, and a **back office (BO)** where the studio manages clients, albums, bookings and the site's own content.

- **Live site:** https://photodej.com/#/home
- **Landing page design (Figma):** https://www.figma.com/file/X4uvSBxAOab0nYU9mrD54m/FOTO-DEJ?node-id=0%3A1
- **Backend repository:** https://github.com/leojk11/fotoDej-cms-api
- **Backend API docs (Postman):** https://documenter.getpostman.com/view/14487622/VUjTmPW7

---

## Want to see the app from the inside?

The public pages (home, gallery) are open to everyone. The **back office** and the **client area** are behind a login, and I don't publish those credentials here.

If you would like to explore the application (for example as a recruiter, a reviewer, or a potential client), get in touch and I will send you a demo account:

| Channel | Where |
| --- | --- |
| Email | [jakimovskil211@gmail.com](mailto:jakimovskil211@gmail.com) |
| GitHub | [@leojk11](https://github.com/leojk11) |
| LinkedIn | [linkedin.com/in/leonidjakimovski](https://www.linkedin.com/in/leonidjakimovski/) |

Please mention which area you would like to see:

- **Back office** - admin account (clients, albums, calendar, requests, invites, settings)
- **Client area** - client account (view albums and select photos)

---

## Features

### Public website
- Landing page with a hero section, a promo image slider, embedded YouTube videos and a contact form.
- Full photo gallery (`/gallery`).
- Everything on the page (titles, logo, promo images and videos, contact details, social links) is driven by the studio's **configuration**, which is edited from the back office - no redeploy needed.
- Every visit is reported to the API (visit counter) and shown on the dashboard.
- Two languages: **Macedonian (default)** and **English**, switchable at runtime.

### Client area (`/client`)
- Clients sign in at `/auth/client`. On first login they are asked to replace the temporary password they were given.
- **My albums** - every album the studio assigned to them.
- **Album preview** - browse photos, open a full-screen image overview, and **select favourite photos**. Selections are saved to the server so the studio can see what the client picked. Clients can select/deselect all, and switch between "all photos" and "selected photos".
- **Profile** page.

### Back office (`/bo`)
Admins sign in at `/auth/bo`. The sidebar contains:

| Section | What it does |
| --- | --- |
| **Dashboard** | Key numbers (including visits), upcoming schedule items. |
| **Clients** | Create, edit, delete clients; suspend / re-activate their accounts; see a client's details, assigned albums and activity log. |
| **Albums** | Create albums, upload images (multi-file upload), assign an album to a client, enable/disable or delete single or multiple images, search images, see which images the client selected. |
| **Calendar** | FullCalendar-based schedule (day grid / list views). Create schedule items with a title, description, date/time, contact number and one or more locations. |
| **Requests** | Messages sent through the public contact form, with filters and pagination. |
| **Invites** | History of invitations (credentials e-mails) sent to clients. |
| **Notifications** | In-app notifications, mark one or all as read. |
| **Settings** | (Super admin only) Edit the website content: logos, hero image and titles (MK/EN), promo images and videos, contact info, social links, notification e-mail addresses and the texts of the client invitation e-mail. |

---

## Roles and access

There are two completely separate sign-ins, each with its own token and route guard:

| Area | Login route | Guard | Storage keys |
| --- | --- | --- | --- |
| Back office (`/bo/**`) | `/auth/bo` | `BoAuthGuard` | `boToken`, `boUser` |
| Client area (`/client/**`) | `/auth/client` | `AuthGuard` | `token`, `user` |

Roles are defined in `src/app/core/data/permissions.enum.ts`:

| Role | Can access |
| --- | --- |
| `OP` | Everything |
| `SUPER_ADMIN` | Everything in the BO, including **Settings** |
| `ADMIN` | BO except **Settings** |
| `CLIENT` | Client area only |

The `[permit]` directive (`PermitDirective`) hides UI elements (such as sidebar items) the current role is not allowed to see, based on the map in `core/data/permissions.ts`. The real enforcement is on the API - the front end only hides things.

---

## How the app works

### Architecture

```
Browser (Angular SPA)  --HTTP-->  fotoDej-cms-api (REST, separate repo)  -->  database + image storage
```

This repository is **only the front end**. All data (clients, albums, images, schedules, configuration...) lives behind the REST API in the backend repository linked above.

- **Standalone components** with lazy-loaded routes (`loadComponent`), no NgModules.
- **State** is kept in small `@ngrx/component-store` stores (`albums.store.ts`, `clients.store.ts`, `configuration.store.ts`, ...) that sit next to a matching `*.service.ts` containing the raw HTTP calls.
- **UI**: [PrimeNG](https://primeng.org) (with `@primeuix/themes`) plus a custom SCSS design system in `src/assets/sass`.
- **i18n**: `@ngx-translate`, translation files in `src/assets/i18n/mk.json` and `en.json`.
- **Other libraries**: FullCalendar (calendar), `ngx-toastr` / toast service (notifications), `ngx-spinner` (loaders), `dayjs` (dates), `@angular/youtube-player` (promo videos).

### Authentication flow

1. The user submits the login form. `AuthService` calls `POST /auth/admin` (back office) or `POST /auth/client` (client).
2. The returned token and user are saved in browser storage through `StorageService` (`boToken`/`boUser` or `token`/`user`).
3. `BasicHttpInterceptor` attaches the stored token to **every** request as the `Authorization` header.
4. Route guards check that the right token and user exist before activating `/bo` or `/client`; the opposite guards (`nonBoAuth`, `nonUserAuth`) keep logged-in users away from the login pages.
5. If the API answers **401**, the interceptor logs the user out of the area they are currently in only (BO users go back to `/auth/bo`, clients back to the home page).

New clients are created by an admin with a temporary password; the client is forced to set their own on first sign-in (`PATCH /client/reset/first_password/:id`).

### Typical end-to-end workflow

1. The studio fills in **Settings** so the public website shows the right content.
2. A visitor finds the site and sends a message through the **contact form** -> it appears under **Requests** (and the studio can be notified by e-mail via the addresses set in Settings).
3. An admin creates a **client** and sends them an **invite** with their credentials.
4. The admin creates an **album**, uploads the photos, and **assigns** it to that client.
5. The client signs in, opens the album, and **selects** the photos they like.
6. The admin opens the album in the BO and reviews the **selected photos**.
7. Shoots and meetings are tracked in the **Calendar**, and the **Dashboard** shows what is coming up.

### Routes

| Path | Description |
| --- | --- |
| `/home` | Public landing page (default) |
| `/gallery` | Public gallery |
| `/auth/client`, `/auth/bo` | Login pages |
| `/client/albums`, `/client/albums/:id`, `/client/profile` | Client area |
| `/bo/dashboard` | BO dashboard |
| `/bo/clients`, `/bo/clients/details/:id` | Client list and details |
| `/bo/albums`, `/bo/albums/:id`, `/bo/albums/upload/:id` | Album list, preview, image upload |
| `/bo/calendar` | Schedule |
| `/bo/requests` | Contact form requests |
| `/bo/invites` | Sent invites |
| `/bo/notifications` | Notifications |
| `/bo/configuration` | Website settings (super admin) |

> The production site uses hash-based URLs (`/#/home`).

### Project structure

```
src/app
├── core/               Guards, interceptor, auth/storage services, permissions, API URL token
├── shared/             Reusable components (album, image overview, paginator, loaders, ...),
│                       directives, shared services and models
└── features/
    ├── auth/           Login and reset-password
    ├── front/          Public website + client area (layout, home, gallery, albums, profile)
    └── bo/             Back office (layout + pages: home, clients, albums, calendar,
                        requests, invites, notifications, configurations)
src/assets/
├── i18n/               mk.json, en.json
├── img/                Static images and SVGs
└── sass/               Global styles (base, layout, components, pages)
src/environments/       environment.ts (dev) and environment.prod.ts (prod)
```

---

## Running it locally

### Prerequisites
- A Node.js version supported by Angular 22 and npm.
- The backend API running locally (see the [backend repository](https://github.com/leojk11/fotoDej-cms-api)) - without it only the static shell of the app loads.

### Setup

```bash
npm install
npm start
```

The app is served at http://localhost:4200 and reloads on code changes.

### Pointing at an API

The API address is set in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
  // apiUrl: 'https://api.photodej.com'
};
```

Use `http://localhost:3000` for a local backend. Production builds use `environment.prod.ts` instead (swapped automatically by `fileReplacements`).

### Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Dev server |
| `npm run build` | Production build into `dist/foto-dej-cms-ng14` |
| `npm run watch` | Development build in watch mode |
| `npm test` | Unit tests (Karma + Jasmine) |

---

## Tech stack

Angular 22 · TypeScript · RxJS · NgRx Component Store · PrimeNG · FullCalendar · ngx-translate · SCSS

## Author

Built and maintained by [@leojk11](https://github.com/leojk11). See the [contact section](#want-to-see-the-app-from-the-inside) above for credentials and questions.
