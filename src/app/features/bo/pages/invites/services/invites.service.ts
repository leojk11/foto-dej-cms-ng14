import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { GetAllInvitesResponse } from '../models/getAllInvitesResponse.model';

@Injectable({
  providedIn: 'root'
})
export class InvitesService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getAll(params: BasicParams): Observable<GetAllInvitesResponse> {
    const path = `${ this.apiUrl }/invites?take=${ params.take }&page=${ params.page }`;
    return this.http.get<GetAllInvitesResponse>(path);
  }

}
