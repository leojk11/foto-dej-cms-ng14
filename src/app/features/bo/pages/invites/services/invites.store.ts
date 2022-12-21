import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
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
    take: 5
  },
  total: 0,

  loading: true
}

@Injectable({
  providedIn: 'root'
})
export class InvitesStore extends ComponentStore<InvitesState> {

  constructor(
    private invitesService: InvitesService
  ) { 
    super(initialState);
  }

  get state() {
    return this.get(s => s);
  }

  setParams(params: BasicParams): void {
    this.patchState({ params: params });
  }

  getInvites(): void {
    this.invitesService.getAll(this.state.params).subscribe({
      next: res => {
        console.log(res);
        
        this.patchState({
          list: res.list,
          total: res.total,
          loading: false
        });
      },
      error: error => {
        // handle error
        console.log(error);
      }
    });
  }

}
