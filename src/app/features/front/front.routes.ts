import { Route, Routes } from "@angular/router";

export const FRONT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/front-layout/front-layout.component')
      .then(m => m.FrontLayoutComponent),
    children: [
      {
        path: 'albums',
        loadComponent: () => import('./pages/albumbs/containers/albums/albums.component')
          .then(m => m.AlbumsComponent),
      }
    ]
  }

]