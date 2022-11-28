import { Route } from '@angular/router';

export const CLIENT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/clients/clients.component')
      .then((m) => m.ClientsComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./containers/client-details/client-details.component')
      .then((m) => m.ClientDetailsComponent)
  }
]