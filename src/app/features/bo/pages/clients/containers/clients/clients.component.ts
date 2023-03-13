import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    TranslateModule,
    ClientCardComponent,
    InputTextModule,
    PaginatorModule,
    OverlayPanelModule
  ],
  providers: [ 
    ClientsStore,
    DialogService
  ],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {

  clients: Client[] = [];
  isMobile: boolean = false;
  modalWidth: string = '';
  nameSearch: string = '';
  phoneSearch: string = '';
  statusSearch: string = '';

  searchTerms: string[] = [];

  statuses = [
    {
      name: 'Active',
      value: 'ACTIVE'
    },
    {
      name: 'Suspended',
      value: 'SUSPENDED'
    }
  ];

  constructor(
    private adminLayoutService: AdminLayoutService,
    public clientStore: ClientsStore,
    private dialog: DialogService,
    private translate: TranslateService,
    public location: Location
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

  onPageChange(event: any): void {
    this.clientStore.patchParams(event.page + 1);
    this.clientStore.getAllClients();
  }

  filter(): void {
    this.searchTerms = [];

    if (this.phoneSearch !== '' && this.nameSearch !== '' && this.statusSearch !== '') {
      this.clientStore.patchState({
        params: {
          ...this.clientStore.state.params,
          name: this.nameSearch,
          phone_number: this.phoneSearch,
          status: this.statusSearch
        }
      });

      this.searchTerms.push(this.nameSearch);
      this.searchTerms.push(this.phoneSearch);
      this.searchTerms.push(this.statusSearch);

    } else {
      this.clientStore.patchState({
        params: {
          page: this.clientStore.state.params.page,
          take: this.clientStore.state.params.take
        }
      });
      this.searchTerms = [];
    }
    
    if(this.nameSearch !== ''){
      this.clientStore.patchState({
        params: {
          ...this.clientStore.state.params,
          name: this.nameSearch
        }
      });

      this.searchTerms.push(this.nameSearch);
    } 
    
    if(this.phoneSearch !== ''){
      this.clientStore.patchState({
        params: {
          ...this.clientStore.state.params,
          phone_number: this.phoneSearch
        }
      });

      this.searchTerms.push(this.phoneSearch);
    } 
    
    if (this.statusSearch !== ''){
      this.clientStore.patchState({
        params: {
          ...this.clientStore.state.params,
          status: this.statusSearch
        }
      });

      this.searchTerms.push(this.statusSearch);
    } 
    
    this.clientStore.getAllClients();
  }

  clearFilter(): void {
    this.nameSearch = '';
    this.phoneSearch = '';
    this.searchTerms = [];
    this.filter();
  }

  clearTerm(index: number): void {
    const term = this.searchTerms.splice(index, 1)[0];
    console.log(term);

    if(term === this.nameSearch) {
      this.nameSearch = '';
    } else if (term === this.phoneSearch) {
      this.phoneSearch = '';
    } else if (term === this.statusSearch) {
      this.statusSearch = '';
    }

    this.filter();
  }
}
