import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { NgxSpinnerService } from "ngx-spinner";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { ToastService } from "src/app/shared/services/toast.service";
import { Request } from "../../requests/models/request.model";
import { RequestsService } from "../../requests/services/requests.service";
import { DashboardCardsData } from "../models/dashboard-cards-data.model";
import { DashboardService } from "./dashboard.service";

export interface DashboardState {
  loading: boolean;
  cardsData: DashboardCardsData;
  pendingRequests: Request[]
}

export const initialState: DashboardState = {
  loading: true,
  cardsData: {} as DashboardCardsData,
  pendingRequests: []
}

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {

  constructor(
    private service: DashboardService,
    private toastService: ToastService,
    private requestService: RequestsService,
    private spinner: NgxSpinnerService
  ) {
    super(initialState)
  }

  get state() {
    return this.get(s => s);
  }

  loadData = this.effect((_$) =>
    _$.pipe(
      switchMap((_) => {
        this.patchState({
          cardsData: {} as DashboardCardsData,
          loading: true,
        })
        this.spinner.show().then();
        return this.service.getDashboardData().pipe(
          tap((res) => {
            console.log('DASHBOARD DATA RES', res);
            
            this.patchState({
              cardsData: res,
              loading: false,
            });
            this.spinner.hide().then();
            this.loadPendingRequests();
          })
        )
      }),
      catchError((err)=>{
        this.patchState({
          ...this.state,
          loading: false,
        });
        this.toastService.addError(err);
        this.spinner.hide().then();
        return EMPTY;
      })
    )
  );

  loadPendingRequests = this.effect((_$) =>
    _$.pipe(
      switchMap((_) => {
        this.patchState({
          ...this.state,
          pendingRequests: []
        });
        this.spinner.show().then();
        return this.requestService.getPendingRequests({page: 1, take: 5}).pipe(
          tap((res) => {
            console.log('PENDING REQUESRS', res);
            
            this.patchState({
              ...this.state,
              pendingRequests: res.list
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