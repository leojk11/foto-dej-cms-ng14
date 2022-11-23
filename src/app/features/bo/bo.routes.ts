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
        loadComponent: () => import('./pages/home/containers/home/home.component').then((m) => m.HomeComponent)
      },
      
    ]
  }
]