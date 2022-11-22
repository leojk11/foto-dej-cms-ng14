import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LoadingState {
  display: boolean;
}; 

export const initialState: LoadingState = {
  display: false
};

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingState = new BehaviorSubject<LoadingState>(initialState);
  loadingState$ = this.loadingState.asObservable();

  constructor() { }

  get state() {
    return this.loadingState.value;
  }

  toggleLoading(value: boolean): void {
    this.loadingState.next({
      display: value
    });
  }
}
