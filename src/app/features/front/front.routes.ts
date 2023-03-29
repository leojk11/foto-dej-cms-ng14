import { Route, } from "@angular/router";
import { PreviewComponent } from "./pages/albums/containers/preview/preview.component";
import { ProfileComponent } from "./pages/profile/profile.component";

export const FRONT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/front-layout/front-layout.component')
      .then(m => m.FrontLayoutComponent),
    children: [
      {
        path: 'albums',
        loadComponent: () => import('./pages/albums/containers/client-albums/client-albums.component')
          .then(m => m.ClientAlbumsComponent)
      },
      {
        path: 'albums/:id',
        component: PreviewComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  }

]