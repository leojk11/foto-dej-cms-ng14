import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ImageOverviewState {
  showOverview: boolean;

  overviewImage: string;
  overviewImages: string[];

  albumId: string;
}

export const initialState: ImageOverviewState = {
  showOverview: false,

  overviewImage: '',
  overviewImages: [],

  albumId: ''
}

@Injectable({
  providedIn: 'root'
})
export class ImageOverviewService {

  overviewState = new BehaviorSubject<ImageOverviewState>(initialState);
  overviewState$ = this.overviewState.asObservable();

  constructor() { }

  get state() {
    return this.overviewState.getValue();
  }

  toggleOverview(albumId?: string): void {
    const overviewBool = this.state.showOverview;

    if (!overviewBool === false) {
      this.overviewState.next({
        ...this.state,
        overviewImage: '',
        overviewImages: []
      });
    }

    this.overviewState.next({
      ...this.state,
      showOverview: !overviewBool,
      albumId: albumId ? albumId : ''
    });
  }

  setImage(image: string): void {
    this.overviewState.next({
      ...this.state,
      overviewImage: image
    });
  }

  setImages(image: string, images: any): void {
    this.overviewState.next({
      ...this.state,
      overviewImage: image,
      overviewImages: images
    });
  }

  changeImage(step: string): void {
    const splitted = this.state.overviewImage.split('/');
    let index = this.state.overviewImages.findIndex((inImage: string) => 
      inImage === splitted[splitted.length - 1]
    );
    
    if (step === 'prev') {
      index = index - 1;
      if (index < 0) {
        index = this.state.overviewImages.length - 1;
      }
    }
    if (step === 'next') {
      index = index + 1;
      
      if (index >= this.state.overviewImages.length) {
        index = 0;
      }
    }

    let path;
    if (this.state.albumId) {
      path = `${ environment.apiUrl }/images/album_image/${ this.state.albumId }/${ this.state.overviewImages[index] }`;
    } else {
      path = `${ environment.apiUrl }/images/${ this.state.overviewImages[index] }`;
    }

    this.overviewState.next({
      ...this.state,
      overviewImage: path
    });
  }

  resetState(): void {
    this.overviewState.next({
      ...this.state,
      overviewImage: '',
      overviewImages: []
    });
  }
}
