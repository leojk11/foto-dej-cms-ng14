import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientsStore } from '../../services/clients.store';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { Client } from '../../models/client.model';
import { ClientCardComponent } from '../../components/client-card/client-card.component';
import {InputTextModule} from 'primeng/inputtext';
import {DialogService} from 'primeng/dynamicdialog';
import { NewClientComponent } from '../new-client/new-client.component';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    TranslateModule,
    ClientCardComponent,
    InputTextModule,
    PaginatorModule
  ],
  providers: [ 
    ClientsStore,
    DialogService
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clients: Client[] = [];
  isMobile: boolean = false;
  modalWidth: string = '';
  nameSearch: string = '';
  phoneSearch: string = '';

  constructor(
    private adminLayoutService: AdminLayoutService,
    public clientStore: ClientsStore,
    private dialog: DialogService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.clients');
    this.clientStore.getAllClients();

    this.adminLayoutService.isMobile$.subscribe({
      next: res => {
        this.isMobile = res;
        this.modalWidth = this.isMobile ? '90%' : '60%';
      }
    });
  }

  openModal(): void {
    const ref = this.dialog.open(NewClientComponent, {
      width: this.modalWidth,
      // height: '70%',
      header: this.translate.instant('clients.newClient')
    });
  }

  deleteClient(client: Client): void {
    this.clientStore.deleteClient(client);
  }

  onPageChange(event: any): void {
    this.clientStore.patchParams(event.page + 1);
    this.clientStore.getAllClients();
  }

  filter(): void {
    if(this.nameSearch !== ''){
      this.clientStore.patchState({
        params: {
          ...this.clientStore.state.params,
          name: this.nameSearch
        }
      })
    } else if(this.phoneSearch !== ''){
      this.clientStore.patchState({
        params: {
          ...this.clientStore.state.params,
          phone_number: this.phoneSearch
        }
      })
    } else {
      this.clientStore.patchState({
        params: {
          page: this.clientStore.state.params.page,
          take: this.clientStore.state.params.take
        }
      })
    }
    
    this.clientStore.getAllClients();
  }
}
