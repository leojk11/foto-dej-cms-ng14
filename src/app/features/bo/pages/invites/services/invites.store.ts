import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { ToastService } from 'src/app/shared/services/toast.service';
import { GetAllInvitesResponse } from '../models/getAllInvitesResponse.model';
import { Invite } from '../models/invites.model';
import { InvitesService } from './invites.service';

export interface InvitesState {
  list: Invite[],
  params: BasicParams,
  total: number;

  loading: boolean;
}

export const initialState: InvitesState = {
  list: [],
  params: {
    page: 1,
    take: 9
  },
  total: 0,

  loading: true
}

@Injectable()
export class InvitesStore extends ComponentStore<InvitesState> {

  constructor(
    private invitesService: InvitesService,
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

  getInvites(filters?: { client: string, date: string }): void {
    this.invitesService.getAll(this.state.params, filters).subscribe({
      next: (res: GetAllInvitesResponse) => {
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
