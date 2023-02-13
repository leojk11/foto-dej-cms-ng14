import {HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { AddNewAlbumResponse } from '../models/addNewAlbumResponse.model';
import { Album } from '../models/album.model';
import { EditResponse } from '../models/editResponse.model';
import { GetAllAlbumsResponse } from '../models/getAllAlbumsResponse.model';
import {GetAlumImagesResponse} from "../models/getAlumImagesResponse.model";
import { GetSelectedImagesResponse } from '../models/getSelectedImagesResponse.model';
import { Image } from '../models/image.model';
import { MessageResponse } from '../models/messageResponse.model';
import { SelectImagesResponse } from '../models/selectImagesResponse.model';

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

  editAlbum(data: Partial<Album>, albumId: string): Observable<EditResponse> {
    const path = `${ this.apiUrl }/albums/${ albumId }`;
    return this.http.patch<EditResponse>(path, data);
  }

  updateStatus(albumId: string | undefined, status: boolean): Observable<MessageResponse> {
    const path = `${ this.apiUrl }/albums/${ albumId }/${ status }`;
    return this.http.patch<MessageResponse>(path, {});
  }

  addImagesToAlbum(id: string, images: string): Observable<any> {
    const path = `${ this.apiUrl }/albums/${ id }/images`;
    return this.http.patch(path, { images });
  }

  getAlbumImages(albumId: string, image?: string): Observable<GetAlumImagesResponse> {
    let path = `${ this.apiUrl }/images/album/${ albumId }`;
    if(image){
      path += `?image=${ image }`;
    }
    
    return this.http.get<GetAlumImagesResponse>(path);
  }

  getSelectedAlbumImages(albumId: string | undefined, image?: string): Observable<GetSelectedImagesResponse> {
    let path = `${ this.apiUrl }/images/album/${ albumId }/selected`;
    if(image){
      path += `?image=${ image }`;
    }

    return this.http.get<GetSelectedImagesResponse>(path);
  }

  selectImages(albumId: string | undefined, images: Image[]): Observable<SelectImagesResponse> {
    const path = `${ this.apiUrl }/images/album/${ albumId }/select`;
    return this.http.post<SelectImagesResponse>(path, { images });
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

  deleteImage(albumId: string | undefined, image: string): Observable<MessageResponse> {
    const path = `${ this.apiUrl }/images/${ albumId }/${ image }`;
    return this.http.delete<any>(path);
  }

  deleteMultipleImages(albumId: string | undefined, images: string[]): Observable<MessageResponse> {
    const path = `${ this.apiUrl }/images/${ albumId }/images`;
    return this.http.delete<any>(path, { body: { images } });
  }

  disableMultipleImages(albumId: string | undefined, images: string[]): Observable<MessageResponse> {
    const path = `${ this.apiUrl }/images/${ albumId }/disable`;
    return this.http.patch<any>(path, { images });
  }
  enableMultipleImages(albumId: string | undefined, images: string[]): Observable<MessageResponse> {
    const path = `${ this.apiUrl }/images/${ albumId }/enable`;
    return this.http.patch<any>(path, { images });
  }

  deleteAlbum(albumId: string): Observable<MessageResponse> {
    const path = `${ this.apiUrl }/albums/${ albumId }`;
    return this.http.delete<any>(path);
  }

  getUserAlbums(userId: string, params: BasicParams): Observable<GetAllAlbumsResponse> {
    const path = `${ this.apiUrl }/albums/assigned/${ userId }`;
    return this.http.get<GetAllAlbumsResponse>(path, {params: this.generateParams(params)});
  }
}
