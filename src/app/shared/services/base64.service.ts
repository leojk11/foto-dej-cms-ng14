import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getBase64Image(image: string): Observable<any> {
    const path = `${ this.apiUrl }/images/base64/${ image }`;
    return this.http.get<any>(path);
  }
}
