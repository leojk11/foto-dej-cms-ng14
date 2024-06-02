import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { BackLogsGetAllResponse } from '../models/back-logs-getAll-response.model';

@Injectable({
  providedIn: 'root'
})
export class BackLogsService {

  apiUrl = inject(API_URL);
  http = inject(HttpClient);

  getAllBackLogs(params: BasicParams): Observable<BackLogsGetAllResponse> {
    const path = `${ this.apiUrl }/logger`;
    return this.http.get<BackLogsGetAllResponse>(path, {params: this.generateParams(params)});
  }

  generateParams(params: BasicParams) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', params.page);
    httpParams = httpParams.set('take', params.take);

    return httpParams;
  }
}
