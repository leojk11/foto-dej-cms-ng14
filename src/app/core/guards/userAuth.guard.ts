import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  public canActivate (): 
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.storageService.getItem('token');
    const user = this.storageService.getItem('user');

    if (!token || !user) {
      this.authService.userLogout();
      this.router.navigateByUrl('/auth/client');
      return false;
    } else {
      return true;
    }
  }
}
