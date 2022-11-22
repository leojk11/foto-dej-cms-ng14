import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, pluck } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { Admin } from '../models/admin.model';
import { Auth } from '../models/auth.model';
import { LoginResponse } from '../models/login-response.model';
import { StorageService } from './storage.service';
// import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState$$ = new BehaviorSubject<Auth>({ authToken: null, user: null });
  authState$ = this.authState$$.asObservable();
  user$ = this.authState$.pipe(pluck('user'));

  constructor(
    @Inject(API_URL) private api: string,
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) { }
   
  get state(): Auth {
    return this.authState$$.getValue();
  }

  get authToken(): any {
    return this.authState$$.getValue()?.authToken;
  }

  get user(): any | null { // change any to something else
    return this.authState$$.getValue()?.user;
  }

  isLoggedInBo(): boolean {
    const token = this.storageService.getItem('boToken');
    const user = this.storageService.getItem('boUser');

    if(token || user) {
      return true;
    } else {
      return false;
    }
  }
  isLoggedInUser(): boolean {
    const token = this.storageService.getItem('token');
    const user = this.storageService.getItem('user');

    if(token || user) {
      return true;
    } else {
      return false;
    }
  }
  
  setAuthToken(token: string): void {
    this.storageService.setItem('token', token);
    this.authState$$.next({ ...this.state, authToken: token });
  }
  setBoAuthToken(token: string): void {
    this.storageService.setItem('boToken', token);
    this.authState$$.next({ ...this.state, authToken: token });
  }

  setUser(user: any): void { // change any model to something else
    this.storageService.setItem('user', JSON.stringify(user));
    this.authState$$.next({ ...this.state, user });
  }
  setBoUser(user: Admin): void {
    this.storageService.setItem('boUser', JSON.stringify(user));
    this.authState$$.next({ ...this.state, user });
  }

  removeAuthToken(): void {
    this.storageService.removeItem('token');
    this.storageService.removeItem('user');
    this.authState$$.next({ authToken: null, user: null });
  }

  adminLogin(formData: { email: string, password: string }): Observable<LoginResponse> {
    const path = `${ this.api }/auth/admin`;
    return this.http.post<LoginResponse>(path, formData);
  }

  userLogin(formData: { email: string, password: string }): Observable<LoginResponse> {
    const path = `${ this.api }/auth/client`;
    return this.http.post<LoginResponse>(path, formData);
  }

  userLogout(): void {
    this.storageService.removeItem('user');
    this.storageService.removeItem('token');

    this.router.navigate(['/auth/user']).then();
  }
  boLogout(): void {
    this.storageService.removeItem('boUser');
    this.storageService.removeItem('boToken');

    this.router.navigate(['/auth/bo']).then();
  }
}
