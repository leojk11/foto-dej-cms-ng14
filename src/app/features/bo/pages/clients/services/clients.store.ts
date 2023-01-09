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

  loading: boolean;
}

export const initialState: ClientsState = {
  list: [],
  params: {
    page: 1,
    take: 5
  },
  total: 0,

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

  deleteClient(client: Client): void {
    this.clientsService.deleteClient(client.id).subscribe({
      next: res => {
        console.log('client delete res', res);
        
        this.patchExistingClientSingle(client);
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
}
