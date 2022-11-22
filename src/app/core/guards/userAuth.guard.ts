import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

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
      this.router.navigateByUrl('/auth/user');
      console.log('yes');
      return false;
    } else {
      console.log('no');
      return true;
    }
  }
}
