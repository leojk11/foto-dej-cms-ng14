import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { NgxSpinnerService } from "ngx-spinner";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { BasicParams } from "src/app/shared/models/basicParams.model";
import { ToastService } from "src/app/shared/services/toast.service";
import { NotificationService } from "./notification.service";

export interface NotificationState {
  loading: boolean;
  params: BasicParams;
  total: number;
  notifications: Notification[];
}

export const initialState: NotificationState = {
  loading: true,
  params: {
    page: 1,
    take: 6
  },
  total: 0,
  notifications: []
}

@Injectable({
  providedIn: 'root'
})
export class NotificationStore extends ComponentStore<NotificationState> {

  constructor(
    private service: NotificationService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) {
    super(initialState)
  }

  get state() {
    return this.get(s => s);
  }

  setParams(params: BasicParams): void {
    this.patchState({
      ...this.state,
      params
    })
  }

  loadNotifications = this.effect((_$) =>
    _$.pipe(
      switchMap((_) => {
        this.patchState({
          loading: false,
          notifications: []
        });
        this.spinner.show().then();
        return this.service.getNotifications(this.state.params).pipe(
          tap((res) => {
            console.log('NOTIFICATIONS', res);
            
            this.patchState({
              ...this.state,
              notifications: res.list,
              total: res.total
            });
            this.spinner.hide().then();
          })
        )
      }),
      catchError((err)=>{
        this.patchState({
          ...this.state,
          loading: false,
        });
        this.spinner.hide().then();

        this.toastService.addError(err);
        return EMPTY;
      })
    )
  );
}