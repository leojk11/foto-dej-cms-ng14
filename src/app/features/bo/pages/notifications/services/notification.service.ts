import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getNotifications(params: BasicParams): Observable<any> {
    const path = `${ this.apiUrl }/notifications?page=${params.page}&take=${params.take}`;
    return this.http.get<any>(path);
  }

  markRead(id: string): Observable<any> {
    const path = `${ this.apiUrl }/notifications/read/${id}`;
    return this.http.patch<any>(path, {});
  }

  markAllRead(): Observable<any> {
    const path = `${ this.apiUrl }/notifications/read/all`;
    return this.http.patch<any>(path, {});
  }
}
