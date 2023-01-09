import { Route, Routes } from "@angular/router";

export const FRONT_ROUTES: Route[] = [
  { 
    path: '', 
    loadComponent: () => import('./pages/home/containers/home/home.component')
      .then(m => m.HomeComponent)
  }

]