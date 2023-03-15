import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { BasicParams } from "src/app/shared/models/basicParams.model";
import { Log } from "src/app/features/bo/pages/logs/models/log.model";
import { ToastService } from "src/app/shared/services/toast.service";
import { LogService } from "./log.service";
import { LogFilter } from "../models/log-filter.model";

export interface LogState {
  list: Log[];
  params: BasicParams;
  total: number;
  loading: boolean;
}

export const initialState: LogState = {
  list: [],
  params: {
    page: 1,
    take: 7
  },
  total: 0,

  loading: true,
}

@Injectable()
export class LogStore extends ComponentStore<LogState> {

  constructor(
    private logService: LogService,
    private toastService: ToastService
  ) {
    super(initialState);
  }

  get state() {
    return this.get(s => s);
  }

  setLoading(loading: boolean): void {
    this.patchState({ loading });
  }

  patchParams(page: number): void {
    const newParams = { ...this.state.params, page };

    this.patchState({ params: newParams });
  }

  getAllLogs(filters?: LogFilter): void {
    this.setLoading(true);
    console.log('PARAMS', this.state.params);
    

    this.logService.getAllLogs(this.state.params, filters).subscribe({
      next: res => {
        console.log('LOGS RESPONSE', res);
        this.patchState({
          list: res.list,
          total: res.total,

          loading: false
        });
      },
      error: error => {
        this.setLoading(false);
        this.toastService.addError(error.error.message);
      }
    })
  }
}