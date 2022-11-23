import { Route } from "@angular/router";
import { BoLayoutComponent } from "./layout/bo-layout/bo-layout.component";

export const BO_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: BoLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/containers/home/home.component')
          .then((m) => m.HomeComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./pages/clients/containers/clients/clients.component')
          .then((m) => m.ClientsComponent)
      },
      {
        path: 'albums',
        loadComponent: () => import('./pages/albums/containers/albums/albums.component')
          .then((m) => m.AlbumsComponent)
      },
      {
        path: 'albums/:id',
        loadComponent: () => import('./pages/albums/containers/album-preview/album-preview.component')
          .then((m) => m.AlbumPreviewComponent)
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
    ]
  }
]