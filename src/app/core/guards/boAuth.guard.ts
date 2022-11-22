import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class BoAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  public canActivate (): 
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.storageService.getItem('boToken');
    const user = this.storageService.getItem('boUser');

    if (!token || !user) {
      this.authService.boLogout();
      this.router.navigateByUrl('/auth/bo');
      return false;
    } else {
      return true;
    }
  }
}
