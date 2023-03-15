import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { ToastService } from "src/app/shared/services/toast.service";
import { DashboardCardsData } from "../models/dashboard-cards-data.model";
import { DashboardService } from "./dashboard.service";

export interface DashboardState {
  loading: boolean;
  cardsData: DashboardCardsData;
}

export const initialState: DashboardState = {
  loading: true,
  cardsData: {} as DashboardCardsData
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
    return this.get(s => s.cardsData);
  }

  loadData = this.effect((_$) =>
    _$.pipe(
      switchMap((_) => {
        this.patchState({
          cardsData: {} as DashboardCardsData,
          loading: true,
        })
        return this.service.getDashboardData().pipe(
          tap((res) => {
            console.log('DASHBOARD DATA RES', res);
            
            this.patchState({
              cardsData: res,
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