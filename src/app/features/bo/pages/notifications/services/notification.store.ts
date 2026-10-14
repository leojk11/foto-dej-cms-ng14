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
  not_read: number;
}

export const initialState: NotificationState = {
  loading: true,
  params: {
    page: 1,
    take: 6
  },
  total: 0,
  notifications: [],
  not_read: 0
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

  get snapshot() {
    return this.get(s => s);
  }

  setParams(params: BasicParams): void {
    this.patchState({
      ...this.snapshot,
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
        return this.service.getNotifications(this.snapshot.params).pipe(
          tap((res) => {
            console.log('NOTIFICATIONS', res);
            
            this.patchState({
              ...this.snapshot,
              notifications: res.list,
              total: res.total,
              not_read: res.not_read
            });
            this.spinner.hide().then();
          })
        )
      }),
      catchError((err)=>{
        this.patchState({
          ...this.snapshot,
          loading: false,
        });
        this.spinner.hide().then();

        this.toastService.addError(err);
        return EMPTY;
      })
    )
  );
}