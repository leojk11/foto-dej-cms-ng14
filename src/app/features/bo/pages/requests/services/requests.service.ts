import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { GetAllRequestsResponse } from '../models/getAllRequestsResponse.model';
import { RequestFilters } from '../models/requestFilters.model';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getAll(params: BasicParams, filters?: Partial<RequestFilters>): Observable<GetAllRequestsResponse> {
    let path = `${ this.apiUrl }/requests?take=${ params.take }&page=${ params.page }`;

    if (filters) {
      if (filters.firstname) {
        path += `&firstname=${ filters.firstname }`;
      }
      if (filters.lastname) {
        path += `&lastname=${ filters.lastname }`;
      }
      if (filters.email) {
        path += `&email=${ filters.email }`;
      }
      if (filters.phone) {
        path += `&phone=${ filters.phone }`;
      }
      if (filters.date) {
        path += `&date=${ filters.date }`;
      }
    }

    return this.http.get<GetAllRequestsResponse>(path);
  }

  getPendingRequests(params: BasicParams): Observable<GetAllRequestsResponse> {
    let path = `${ this.apiUrl }/requests/pending?take=${ params.take }&page=${ params.page }`;
    return this.http.get<GetAllRequestsResponse>(path)
  }
}
