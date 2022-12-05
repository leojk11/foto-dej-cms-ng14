import {HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { AddNewAlbumResponse } from '../models/addNewAlbumResponse.model';
import { Album } from '../models/album.model';
import { GetAllAlbumsResponse } from '../models/getAllAlbumsResponse.model';
import {GetAlumImagesResponse} from "../models/getAlumImagesResponse.model";

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getAllAlbums(params: BasicParams): Observable<GetAllAlbumsResponse> {
    const path = `${ this.apiUrl }/albums`;
    return this.http.get<GetAllAlbumsResponse>(path, {params: this.generateParams(params)});
  }

  generateParams(params: BasicParams) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('take', params.take)
    httpParams = httpParams.set('page', params.page)

    if(params.title) 
      httpParams = httpParams.set('title', params.title)

    if(params.date) 
      httpParams = httpParams.set('date', params.date)
    return httpParams
  }

  getSingleAlbum(id: string): Observable<Album> {
    const path = `${ this.apiUrl }/albums/${ id }`;
    return this.http.get<Album>(path);
  }

  addNewAlbum(payload: { title: string }): Observable<AddNewAlbumResponse> {
    const path = `${ this.apiUrl }/albums`;
    return this.http.post<AddNewAlbumResponse>(path, payload);
  }

  editAlbum(data: Partial<Album>, albumId: string): Observable<any> {
    const path = `${ this.apiUrl }/albums/${ albumId }`;
    return this.http.patch<any>(path, data);
  }

  addImagesToAlbum(id: string, images: string): Observable<any> {
    const path = `${ this.apiUrl }/albums/${ id }/images`;
    return this.http.patch(path, { images });
  }


  getAlbumImages(albumId: string): Observable<GetAlumImagesResponse> {
    const path = `${ this.apiUrl }/images/album/${ albumId }`;
    return this.http.get<GetAlumImagesResponse>(path);
  }

  uploadImages(file: File, albumId: string | undefined): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('images', file);

    const path = `${ this.apiUrl }/images/${ albumId }`;
    const req = new HttpRequest('POST', path, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  deleteImage(albumId: string | undefined, image: string): Observable<any> {
    const path = `${ this.apiUrl }/images/${ albumId }/${ image }`;
    return this.http.delete<any>(path);
  }

}
