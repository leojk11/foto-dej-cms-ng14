import { Routes } from "@angular/router";

export const LOGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/logs/logs.component')
      .then(c => c.LogsComponent)
  }
]