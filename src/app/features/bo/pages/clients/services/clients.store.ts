import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { BasicParams } from "src/app/shared/models/basicParams.model";
import { Client } from "../models/client.model";
import { ClientsService } from "./clients.service";
import {AddNewClientPayload} from "../models/addNewClientPayload.model";
import { ToastService } from "src/app/shared/services/toast.service";
import { NgxSpinnerService } from "ngx-spinner";

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
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) {
    super(initialState);
  }

  get snapshot() {
    return this.get(s => s);
  }

  setLoading(loading: boolean): void {
    this.patchState({ loading });
  }

  getAllClients(name?: string): void {
    this.setLoading(true);
    this.spinner.show().then();
    this.clientsService.getAllCLients(this.snapshot.params, name).subscribe({
      next: res => {
        this.patchState({
          list: res.list,
          total: res.total,

          loading: false
        });
        this.spinner.hide().then();
      },
      error: error => {
        this.setLoading(false);
        this.spinner.hide().then();
        this.toastService.addError(error.error.message);
      }
    });
  }

  pathExistingClients(client: Client): void {
    const list = this.snapshot.list;
    list.push(client);

    this.patchState({
      list,
      total: this.snapshot.total + 1
    });
  }
  
  patchExistingClientSingle(client: Client): void {
    const list = this.snapshot.list;

    const index = this.snapshot.list.findIndex(inClient => inClient.id === client.id);
    list[index] = client;

    this.patchState({ list });
  }

  patchParams(page: number): void {
    const newParams = { ...this.snapshot.params, page };

    this.patchState({ params: newParams });
  }

  getSingleClient(id: string): void {
    this.setLoading(true);
    this.spinner.show().then();
    this.clientsService.getSingleClient(id).subscribe({
      next: client => {
        this.patchState({
          ...this.snapshot,
          client: client
        });

        this.setLoading(false);
        this.spinner.hide().then();

      },
      error: err => {
        console.error(err);
        this.toastService.addError(err.error.message);
        this.setLoading(false);
        this.spinner.hide().then();
      }
    });
  }

  addNewClient(payload: AddNewClientPayload): void {
    this.spinner.show().then();

    this.clientsService.addNewClient(payload).subscribe({
      next: res => {
        this.toastService.addSuccess(res.message);
        this.pathExistingClients(res.client);
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  deleteClient(id: string): void {
    this.spinner.show().then();

    this.clientsService.deleteClient(id).subscribe({
      next: res => {
        console.log('client delete res', res);
        // this.patchExistingClientSingle(client);
        this.getAllClients();
        this.spinner.hide().then();

        this.toastService.addSuccess(res.message);
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  inviteClient(id: string): void {
    this.spinner.show().then();

    this.clientsService.inviteClient(id).subscribe({
      next: res => {
        this.toastService.addSuccess(res.message);
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  suspendClientAccount(id: string): void {
    this.spinner.show().then();
    this.clientsService.suspendAccount(id).subscribe({
      next: res => {
        console.log('ACCOUNT SUSPENDED', res);
        this.getSingleClient(id);
        this.toastService.addSuccess(res.message);
        this.spinner.hide().then();
      },
      error: err => {
        console.error(err);
        this.toastService.addError(err);
        this.spinner.hide().then();
      }
    });
  }

  activateClientAccount(id: string): void {
    this.spinner.show().then();
    this.clientsService.activateAccount(id).subscribe({
      next: res => {
        console.log('ACCOUNT ACTIVATED', res);
        this.getSingleClient(id);
        this.toastService.addSuccess(res.message);
        this.spinner.hide().then();
      },
      error: err => {
        console.error(err);
        this.toastService.addError(err);
        this.spinner.hide().then();
      }
    });
  }
}
