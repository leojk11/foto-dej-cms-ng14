import { Route } from "@angular/router";
import { BoNonAuthGuard } from "src/app/core/guards/nonBoAuth.guard";
import { UserNonAuthGuard } from "src/app/core/guards/nonUserAuth.guard";

export const AUTH_ROUTES: Route[] = [
  { path: '', redirectTo: '/bo', pathMatch: 'full' },
  { 
    path: 'client', 
    loadComponent: () => import('./containers/user-login/user-login.component')
      .then(m => m.UserLoginComponent), 
    canActivate: [UserNonAuthGuard]
  },
  { 
    path: 'bo', 
    loadComponent: () => import('./containers/bo-login/bo-login.component')
      .then(m => m.BoLoginComponent), 
    canActivate: [BoNonAuthGuard] 
  }
]