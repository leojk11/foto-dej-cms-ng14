import { Route, } from "@angular/router";
import { PreviewComponent } from "./pages/albums/containers/preview/preview.component";

export const FRONT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/front-layout/front-layout.component')
      .then(m => m.FrontLayoutComponent),
    children: [
      {
        path: 'albums',
        loadComponent: () => import('./pages/albums/containers/albums/albums.component')
          .then(m => m.AlbumsComponent)
      },
      {
        path: 'albums/:id',
        component: PreviewComponent
      }
    ]
  }

]