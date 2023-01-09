import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';

export interface AdminLayoutState {
  pageTitle: string;
  detail: string;
  detailMore: string;
};

export const initialState: AdminLayoutState = {
  pageTitle: '',
  detail: '',
  detailMore: ''
};

@Injectable({
  providedIn: 'root'
})
export class AdminLayoutService {

  adminLayoutState = new BehaviorSubject<AdminLayoutState>(initialState);
  adminLayoutState$ = this.adminLayoutState.asObservable();

  isMobile$: Observable<boolean> = this.brakepointObserver.observe('(max-width: 887px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private brakepointObserver: BreakpointObserver
  ) { }

  get state() {
    return this.adminLayoutState.getValue();
  }

  setTitle(title: string, detail?: string): void {
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
      detail: '',
      detailMore: ''
    });
  }
}
