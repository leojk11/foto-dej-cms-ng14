import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClientsStore } from '../../services/clients.store';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { Client } from '../../models/client.model';
import { ClientCardComponent } from '../../components/client-card/client-card.component';
import {InputTextModule} from 'primeng/inputtext';
import {DialogService} from 'primeng/dynamicdialog';
import { NewClientComponent } from '../new-client/new-client.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    TranslateModule,
    ClientCardComponent,
    InputTextModule
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

  constructor(
    private adminLayoutService: AdminLayoutService,
    public clientStore: ClientsStore,
    private dialog: DialogService
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.clients');
    this.clientStore.getAllClients();

    this.adminLayoutService.isMobile$.subscribe({
      next: res => {
        this.isMobile = res;
        this.modalWidth = this.isMobile ? '90%' : '55%'
      }
    })
  }

  ngAfterViewInit() {
  }

  openModal(): void {
    const ref = this.dialog.open(NewClientComponent, {
      width: this.modalWidth,
      height: '90%',
      showHeader: false
    });
  }

  openEditModal(client: Client): void {
    const ref = this.dialog.open(NewClientComponent, {
      // width: '45%',
      // height: '75%',
      data: client,
      showHeader: false
    });
  }

  deleteClient(client: Client): void {
    this.clientStore.deleteClient(client);
  }


}
