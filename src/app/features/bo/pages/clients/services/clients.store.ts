import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { BasicParams } from "src/app/shared/models/basicParams.model";
import { Client } from "../models/client.model";
import { ClientsService } from "./clients.service";
import {AddNewClientPayload} from "../models/addNewClientPayload.model";
import { ToastService } from "src/app/shared/services/toast.service";

export interface ClientsState {
  list: Client[],
  params: BasicParams,
  total: number;
  client: Client;
  loading: boolean;
}

export const initialState: ClientsState = {
  list: [],
  params: {
    page: 1,
    take: 5
  },
  total: 0,
  client: {} as Client,

  loading: true,
}

@Injectable()
export class ClientsStore extends ComponentStore<ClientsState> {

  constructor(
    private clientsService: ClientsService,
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

  getAllClients(name?: string): void {
    this.setLoading(true);

    this.clientsService.getAllCLients(this.state.params, name).subscribe({
      next: res => {
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
    });
  }

  pathExistingClients(client: Client): void {
    const list = this.state.list;
    list.push(client);

    this.patchState({
      list,
      total: this.state.total + 1
    });
  }
  
  patchExistingClientSingle(client: Client): void {
    const list = this.state.list;

    const index = this.state.list.findIndex(inClient => inClient.id === client.id);
    list[index] = client;

    this.patchState({ list });
  }

  patchParams(page: number): void {
    const newParams = { ...this.state.params, page };

    this.patchState({ params: newParams });
  }

  getSingleClient(id: string): void {
    this.setLoading(true);

    this.clientsService.getSingleClient(id).subscribe({
      next: client => {
        this.patchState({
          ...this.state,
          client: client
        });

        this.setLoading(false);
      },
      error: err => {
        console.error(err);
        this.toastService.addError(err.error.message);
        this.setLoading(false);
      }
    });
  }

  addNewClient(payload: AddNewClientPayload): void {
    this.clientsService.addNewClient(payload).subscribe({
      next: res => {
        this.toastService.addSuccess(res.message);
        this.pathExistingClients(res.client);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  deleteClient(id: string): void {
    this.clientsService.deleteClient(id).subscribe({
      next: res => {
        console.log('client delete res', res);
        // this.patchExistingClientSingle(client);
        this.getAllClients();

        this.toastService.addSuccess(res.message);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  inviteClient(id: string): void {
    this.clientsService.inviteClient(id).subscribe({
      next: res => {
        this.toastService.addSuccess(res.message);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  suspendClientAccount(id: string): void {
    this.clientsService.suspendAccount(id).subscribe({
      next: res => {
        console.log('ACCOUNT SUSPENDED', res);
        this.getSingleClient(id);
        this.toastService.addSuccess(res.message);
      },
      error: err => {
        console.error(err);
        this.toastService.addError(err);
      }
    });
  }

  activateClientAccount(id: string): void {
    this.clientsService.activateAccount(id).subscribe({
      next: res => {
        console.log('ACCOUNT ACTIVATED', res);
        this.getSingleClient(id);
        this.toastService.addSuccess(res.message);
      },
      error: err => {
        console.error(err);
        this.toastService.addError(err);
      }
    });
  }
}
