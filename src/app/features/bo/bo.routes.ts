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
        path: 'configuration',
        loadComponent: () => import('./pages/configurations/containers/configuration/configuration.component')
          .then((m) => m.ConfigurationComponent)
      },
    ]
  }
]