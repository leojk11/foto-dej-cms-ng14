import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { ToastService } from 'src/app/shared/services/toast.service';
import { GetAllRequestsResponse } from '../models/getAllRequestsResponse.model';
import { Request } from '../models/request.model';
import { RequestFilters } from '../models/requestFilters.model';
import { RequestsService } from './requests.service';

export interface RequestsState {
  list: Request[];
  params: BasicParams;
  total: number;

  loading: boolean;
}

export const initialState: RequestsState = {
  list: [],
  params: {
    page: 1,
    take: 9
  },
  total: 0,

  loading: true
}

@Injectable()
export class RequestsStore extends ComponentStore<RequestsState> {

  constructor(
    private requestsService: RequestsService,
    private toastService: ToastService
  ) { 
    super(initialState);
  }

  get state() {
    return this.get(s => s);
  }

  setParams(params: BasicParams): void {
    this.patchState({ params: params });
  }

  getRequests(filters?: Partial<RequestFilters>): void {
    this.requestsService.getAll(this.state.params, filters).subscribe({
      next: (res: GetAllRequestsResponse) => {
        this.patchState({
          list: res.list,
          total: res.total,
          loading: false
        });
      },
      error: (error: any) => {
        this.patchState({ loading: false });
        this.toastService.addError(error.error.message);
      }
    });
  }

}
