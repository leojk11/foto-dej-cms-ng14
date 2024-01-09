import { HttpClient, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { Configuration } from '../models/configuration.model';
import { UpdateConfResponse } from '../models/updateConfResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getConfiguration(): Observable<Configuration> {
    const path = `${ this.apiUrl }/conf`;
    return this.http.get<Configuration>(path);
  }

  updateConfiguration(body: Partial<Configuration>): Observable<UpdateConfResponse> {
    const path = `${ this.apiUrl }/conf`;
    return this.http.patch<UpdateConfResponse>(path, body);
  }

  clearPromoImages(): Observable<UpdateConfResponse> {
    const path = `${ this.apiUrl }/conf/images/promo/clear`;
    return this.http.patch<UpdateConfResponse>(path, {});
  }

  uploadImage(file: any, albumId: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('images', file);

    const path = `${ this.apiUrl }/images/${ albumId }`;    
    const req = new HttpRequest('POST', path, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  uploadVideo(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('video', file);

    const path = `${ this.apiUrl }/videos`;
    const req = new HttpRequest('POST', path, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getSingleImage(image: string): Observable<any> {
    const path = `${ this.apiUrl }/images/${ image }`;
    return this.http.get(path, { responseType: 'blob' });
  }

  deleteSingleImage(image: string): Observable<any> {
    const path = `${ this.apiUrl }/images/${ image }`;
    return this.http.delete(path);
  }

  getImageBase64(image: string): Observable<any> {
    const path = `${ this.apiUrl }/images/base64/${ image }`;
    return this.http.get<any>(path);
  }
}
