import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { GetAllClientsResponse } from '../models/getAllResponse.model';
import {AddNewClientPayload} from "../models/addNewClientPayload.model";
import {AddNewClientResponse} from "../models/addNewClientResponse.model";
import {Client} from "../models/client.model";
import {EditClientResponse} from "../models/editClientResponse.model";

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getAllCLients(params: BasicParams): Observable<GetAllClientsResponse> {
    const path = `${ this.apiUrl }/client?page=${ params.page }&take=${ params.take }`;
    return this.http.get<GetAllClientsResponse>(path);
  }

  getSingleClient(id: string): Observable<Client> {
    const path = `${ this.apiUrl }/client/${ id }`;
    return this.http.get<Client>(path);
  }

  addNewClient(payload: AddNewClientPayload): Observable<AddNewClientResponse> {
    const path = `${ this.apiUrl }/client`;
    return this.http.post<AddNewClientResponse>(path, payload);
  }

  editClient(id: string, payload: Partial<Client>): Observable<EditClientResponse> {
    const path = `${ this.apiUrl }/client/${ id }`;
    return this.http.put<EditClientResponse>(path, payload);
  }

  deleteClient(id: string): Observable<any> {
    const path = `${ this.apiUrl }/client/delete/${ id }`;
    return this.http.delete<any>(path);
  }
}
