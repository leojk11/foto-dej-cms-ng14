import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/tokens/api-url.token';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';

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

  // imagesUrl: string = `${ environment.apiUrl }/images/`;
  // videoUrl: string = `${ environment.apiUrl }/videos/`

  // <img 
  // [src]="imagesUrl + image"
  // (click)="toggleOverviewPromo($event, configuration?.promo_images)"

//   <video *ngIf="configuration?.promo_video" controls width="100%" height="300px">
//    <source [src]="videoUrl + configuration?.promo_video">
//   </video>
}
