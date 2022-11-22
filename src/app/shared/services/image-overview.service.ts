import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ImageOverviewState {
  showOverview: boolean;

  overviewImage: string;
  overviewImages: string[];
}

export const initialState: ImageOverviewState = {
  showOverview: false,

  overviewImage: '',
  overviewImages: []
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

  toggleOverview(): void {
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
      showOverview: !overviewBool
    });
  }

  setImage(image: string): void {
    this.overviewState.next({
      ...this.state,
      overviewImage: image
    });
  }

  setImages(image: string, images: any): void {
    console.log('images', images);
    
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

    this.overviewState.next({
      ...this.state,
      overviewImage: `${ environment.apiUrl }/images/${ this.state.overviewImages[index] }`
    });
  }

  resetState(): void {
    this.overviewState.next({
      ...this.state,
      overviewImage: '',
      overviewImages: []
    });

    console.log('state after reset', this.state);
    
  }
}
