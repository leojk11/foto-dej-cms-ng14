import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class BoNonAuthGuard  {

  constructor(
    private auth: AuthService, 
    private router: Router
    ) { }

  canLoad(): boolean {
    return this.canAccessRoute();
  }

  canActivate(): boolean {
    return this.canAccessRoute();
  }

  private canAccessRoute(): boolean {
    if (this.auth.isLoggedInBo()) {
      this.router.navigate(['/bo']).then();
      return false;
    }
    return true;
  }
}
