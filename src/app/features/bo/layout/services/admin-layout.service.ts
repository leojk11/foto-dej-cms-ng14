import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AdminLayoutState {
  pageTitle: string;
  detail: string;
};

export const initialState: AdminLayoutState = {
  pageTitle: '',
  detail: ''
};

@Injectable({
  providedIn: 'root'
})
export class AdminLayoutService {

  adminLayoutState = new BehaviorSubject<AdminLayoutState>(initialState);
  adminLayoutState$ = this.adminLayoutState.asObservable();

  constructor() { }

  get state() {
    return this.adminLayoutState.getValue();
  }

  setTitle(title: string, detail?: string): void {
    console.log('TITLE TO SET', title);
    this.adminLayoutState.next({
      ...this.state,
      pageTitle: title
    });

    if(detail){
      this.adminLayoutState.next({
        ...this.state,
        detail
      });
    }
  }

  resetDetail(): void{
    this.adminLayoutState.next({
      ...this.state,
      detail: ''
    })
  }
}
