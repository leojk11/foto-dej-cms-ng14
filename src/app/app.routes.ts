import { Routes } from "@angular/router";
import { BoAuthGuard } from "./core/guards/boAuth.guard";
import { AuthGuard } from "./core/guards/userAuth.guard";
import { AUTH_ROUTES } from "./features/auth/auth.routes";
import { BO_ROUTES } from "./features/bo/bo.routes";
import { FRONT_ROUTES } from "./features/front/front.routes";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/front/pages/home/containers/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./features/front/pages/gallery/containers/gallery/gallery.component')
      .then(m => m.GalleryComponent)
  },
  {
    path: 'auth',
    children: [
      ...AUTH_ROUTES
    ]
  },
  {
    path: 'bo', 
    canActivate: [BoAuthGuard],
    children: [
      ...BO_ROUTES
    ]
  },
  {
    path: 'client', 
    canActivate: [AuthGuard],
    children: [
      ...FRONT_ROUTES
    ]
  }
]