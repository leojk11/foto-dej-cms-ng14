import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
  
@Injectable()
export class BasicHttpInterceptor implements HttpInterceptor {
  
  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthToken(request)).pipe(map((event: HttpEvent<any>) => event), 
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.authService.userLogout();

        const boToken = this.storageService.getItem('boToken');
        const userToken = this.storageService.getItem('token');
  
        if(boToken) {
          this.authService.boLogout();
        }
        if(userToken) {
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