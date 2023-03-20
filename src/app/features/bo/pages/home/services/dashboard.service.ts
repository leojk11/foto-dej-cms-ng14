import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { Schedule } from '../../calendar/models/schedule.model';

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

  getUpcomingEvents(limit: number): Observable<Schedule[]> {
    const path = `${ this.apiUrl }/schedules/for/user/upcoming?limit=${limit}`;
    return this.http.get<Schedule[]>(path);
  }
}
