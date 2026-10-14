import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
  
@Injectable()
export class BasicHttpInterceptor implements HttpInterceptor {
  
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    // private toastService: ToastService // commented out beacuse its throwing error (will handle it later)
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthToken(request)).pipe(map((event: HttpEvent<any>) => event), 
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !this.router.url.startsWith('/auth')) {
        // log out of the area the user is in only, so a client never lands on the bo login page
        if (this.router.url.startsWith('/bo')) {
          this.authService.boLogout();
        } else {
          this.authService.userLogout();
        }
      }
      return throwError(() => error);
    }));
  }

  addAuthToken(request: HttpRequest<any>) {
    let token;

    const boToken = this.storageService.getItem('boToken');
    const userToken = this.storageService.getItem('token');

    if(boToken) {
      token = boToken;
    }
    if(userToken) {
      token = userToken;
    }

    return request.clone({
      setHeaders: {
        Authorization: `Basic ${ token }`
      }
    })
  }
}