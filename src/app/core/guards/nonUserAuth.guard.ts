import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserNonAuthGuard implements CanActivate, CanLoad {

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
    if (this.auth.isLoggedInUser()) {
      this.router.navigate(['/home']).then();
      return false;
    }
    return true;
  }
}
