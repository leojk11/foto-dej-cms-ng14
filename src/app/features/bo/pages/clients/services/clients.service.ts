import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { GetAllClientsResponse } from '../models/getAllResponse.model';
import {AddNewClientPayload} from "../models/addNewClientPayload.model";
import {AddNewClientResponse} from "../models/addNewClientResponse.model";
import { Client, ClientSearchParams } from "../models/client.model";
import {EditClientResponse} from "../models/editClientResponse.model";

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getAllCLients(params: BasicParams, name?:string): Observable<any> {
    let path = `${ this.apiUrl }/client`;
    
    return this.http.get<any>(path, {params: this.generateParams(params)});
  }

  generateParams(params: BasicParams) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', params.page)
    httpParams = httpParams.set('take', params.take)

    if(params.name) 
      httpParams = httpParams.set('name', params.name)

    if(params.phone_number) 
      httpParams = httpParams.set('phone_number', params.phone_number)
    return httpParams
  }

  getSingleClient(id: any): Observable<Client> {
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

  inviteClient(id: string): Observable<any> {
    const path = `${ this.apiUrl }/client/${ id }`;
    return this.http.post<EditClientResponse>(path, {});
  }
}
