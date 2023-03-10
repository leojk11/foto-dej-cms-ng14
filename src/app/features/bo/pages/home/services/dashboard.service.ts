import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getDashboardData(): Observable<any> {
    const path = `${ this.apiUrl }/dashboard`;
    return this.http.get<any>(path)
  }
}
