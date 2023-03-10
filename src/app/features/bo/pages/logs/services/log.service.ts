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

    if (filters) {
      if (filters.client) {
        path += `&client=${ filters.client }`;
      }
      if (filters.date) {
        path += `&date=${ filters.date }`;
      }
      if (filters.action) {
        path += `&action=${ filters.action }`;
      }
    }

    return this.http.get<any>(path, {params: this.generateParams(params)});
  }

  generateParams(params: BasicParams) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', params.page);
    httpParams = httpParams.set('take', params.take);

    return httpParams;
  }
}
