import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { NgxSpinnerService } from "ngx-spinner";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { ToastService } from "src/app/shared/services/toast.service";
import { Schedule } from "../../calendar/models/schedule.model";
import { Request } from "../../requests/models/request.model";
import { RequestsService } from "../../requests/services/requests.service";
import { DashboardCardsData } from "../models/dashboard-cards-data.model";
import { DashboardService } from "./dashboard.service";

export interface DashboardState {
  loading: boolean;
  cardsData: DashboardCardsData;
  pendingRequests: Request[];
  events: Schedule[];
}

export const initialState: DashboardState = {
  loading: true,
  cardsData: {} as DashboardCardsData,
  pendingRequests: [],
  events: []
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

  get snapshot() {
    return this.get(s => s);
  }

  loadData = this.effect((_$) =>
    _$.pipe(
      switchMap((_) => {
        this.patchState({
          cardsData: {} as DashboardCardsData,
          loading: true,
        });

        this.spinner.show().then();
        return this.service.getDashboardData().pipe(
          tap((res) => {
            this.patchState({
              cardsData: res,
              loading: false,
            });
            this.loadPendingRequests();
          })
        )
      }),
      catchError((err)=>{
        this.patchState({
          ...this.snapshot,
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
          ...this.snapshot,
          pendingRequests: []
        });
        return this.requestService.getPendingRequests({page: 1, take: 5}).pipe(
          tap((res) => {
            this.patchState({
              ...this.snapshot,
              pendingRequests: res.list
            });
            this.loadEvents();
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

  loadEvents = this.effect((_$) =>
    _$.pipe(
      switchMap((_) => {
        this.patchState({
          ...this.snapshot,
          events: []
        });
        // this.spinner.show().then();
        return this.service.getUpcomingEvents(6).pipe(
          tap((res) => {
            this.patchState({
              ...this.snapshot,
              events: res
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