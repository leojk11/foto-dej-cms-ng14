import { Route } from "@angular/router";
import { CLIENT_ROUTES } from "./pages/clients/client.routes";

export const BO_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/bo-layout/bo-layout.component')
      .then(c => c.BoLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/home/containers/home/home.component')
          .then((m) => m.HomeComponent)
      },
      {
        path: 'clients',
        children: [ ...CLIENT_ROUTES ]
      },
      {
        path: 'albums',
        loadComponent: () => import('./pages/albums/containers/bo-albums/bo-albums.component')
          .then((m) => m.BoAlbumsComponent)
      },
      {
        path: 'albums/:id',
        loadComponent: () => import('./pages/albums/containers/bo-preview/bo-preview.component')
          .then((m) => m.BoPreviewComponent)
      },
      {
        path: 'albums/upload/:id',
        loadComponent: () => import('./pages/albums/containers/album-upload/album-upload.component')
          .then((m) => m.AlbumUploadComponent)
      },
      {
        path: 'configuration',
        loadComponent: () => import('./pages/configurations/containers/configuration/configuration.component')
          .then((m) => m.ConfigurationComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./pages/calendar/containers/calendar/calendar.component')
          .then((m) => m.CalendarComponent)
      },
      {
        path: 'invites',
        loadComponent: () => import('./pages/invites/containers/invites/invites.component')
          .then((m) => m.InvitesComponent)
      },
      {
        path: 'requests',
        loadComponent: () => import('./pages/requests/containers/requests/requests.component')
          .then((m) => m.RequestsComponent)
      },
      {
        path: 'logs',
        loadComponent: () => import('./pages/logs/containers/logs/logs.component')
          .then(c => c.LogsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/containers/notifications/notifications.component')
          .then((m) => m.NotificationsComponent)
      },
      {
        path: 'back-logs',
        loadComponent: () => import('./pages/back-logs/containers/back-logs.component')
          .then((m) => m.BackLogsComponent)
      },
    ]
  },
]