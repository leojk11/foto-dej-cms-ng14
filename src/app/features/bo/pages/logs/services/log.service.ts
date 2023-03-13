import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { LogFilter } from '../models/log-filter.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getAllLogs(params: BasicParams, filters?: LogFilter): Observable<any> {
    let path = `${ this.apiUrl }/client_logs`;
    return this.http.get<any>(path, {params: this.generateParams(params, filters)});
  }

  generateParams(params: BasicParams, filters?: LogFilter) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', params.page);
    httpParams = httpParams.set('take', params.take);

    if (filters) {
      if (filters.client) {
        httpParams = httpParams.set('client', filters.client);
      }
      if (filters.date) {
        httpParams = httpParams.set('date' ,filters.date)    
      }
      if (filters.action) {
        httpParams = httpParams.set('action', filters.action);
      }
    }

    return httpParams;
  }
}
