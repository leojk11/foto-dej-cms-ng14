import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { RequestResponse } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class FrontConfigurationService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getConfiguration(): Observable<Configuration> {
    const path = `${ this.apiUrl }/conf`;
    return this.http.get<Configuration>(path);
  }

  sendRequest(body: Request): Observable<RequestResponse> {
    const path = `${ this.apiUrl }/requests`;
    return this.http.post<RequestResponse>(path, body);
  }
}
