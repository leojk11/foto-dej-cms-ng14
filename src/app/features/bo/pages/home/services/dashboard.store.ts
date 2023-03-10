import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { ToastService } from "src/app/shared/services/toast.service";
import { DashboardService } from "./dashboard.service";

export interface DashboardState {
  loading: boolean;
  data: any;
}

export const initialState: DashboardState = {
  loading: true,
  data: []
}

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {

  constructor(
    private service: DashboardService,
    private toastService: ToastService
  ) {
    super(initialState)
  }

  get state() {
    return this.get(s => s);
  }

  get data() {
    return this.get(s => s.data);
  }

  loadData = this.effect((_$) =>
    _$.pipe(
      switchMap((_) => {
        this.patchState({
          data: [],
          loading: true,
        })
        return this.service.getDashboardData().pipe(
          tap((res) => {
            console.log('DASHBOARD DATA RES', res);
            
            this.patchState({
              data: res,
              loading: false,
            })
          })
        )
      }),
      catchError((err)=>{
        this.patchState({
          ...this.data,
          loading: false,
        });
        this.toastService.addError(err);
        return EMPTY;
      })
    )
  )
}