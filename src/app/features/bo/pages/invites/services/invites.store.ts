import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { NgxSpinnerService } from 'ngx-spinner';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { ToastService } from 'src/app/shared/services/toast.service';
import { InviteFilter } from '../containers/invites/invites.component';
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
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) { 
    super(initialState);
  }

  get snapshot() {
    return this.get(s => s);
  }

  setParams(params: BasicParams): void {
    this.patchState({ params: params });
  }

  getInvites(filters?: InviteFilter): void {
    this.spinner.show().then();

    this.invitesService.getAll(this.snapshot.params, filters).subscribe({
      next: (res: GetAllInvitesResponse) => {
        // console.log('INVITES', res);
        
        this.patchState({
          list: res.list,
          total: res.total,
          loading: false
        });
        this.spinner.hide().then();
      },
      error: (error: any) => {
        this.patchState({ loading: false });
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

}
