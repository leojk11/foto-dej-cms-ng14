import { Routes } from "@angular/router";
import { BoAuthGuard } from "./core/guards/boAuth.guard";
import { AuthGuard } from "./core/guards/userAuth.guard";
import { AUTH_ROUTES } from "./features/auth/auth.routes";
import { BO_ROUTES } from "./features/bo/bo.routes";
import { FRONT_ROUTES } from "./features/front/front.routes";

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
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
    path: '', 
    canActivate: [AuthGuard],
    children: [
      ...FRONT_ROUTES
    ]
  }
]