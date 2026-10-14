import { RevealDirective } from 'src/app/shared/directives/reveal.directive';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClientsStore } from '../../services/clients.store';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { Client } from '../../models/client.model';
import { ClientCardComponent } from '../../components/client-card/client-card.component';
import {InputTextModule} from 'primeng/inputtext';
import {DialogService} from 'primeng/dynamicdialog';
import { NewClientComponent } from '../new-client/new-client.component';
import { PaginatorModule } from 'primeng/paginator';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-clients',
    imports: [
        RevealDirective,
        CommonModule,
        TranslatePipe,
        ClientCardComponent,
        InputTextModule,
        PaginatorModule,
        PopoverModule,
        SelectModule,
        FormsModule
    ],
    providers: [
        ClientsStore,
        DialogService
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
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

  statuses: any[] = [];

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
    this.translateStatuses();

    this.adminLayoutService.isMobile$.subscribe({
      next: res => {
        this.isMobile = res;
        this.modalWidth = this.isMobile ? '90%' : '60%';
      }
    });

    this.translate.onLangChange.subscribe(() => {
      this.translateStatuses();
    });
  }

  translateStatuses(): void {
    this.statuses = [
      {
        name: this.translate.instant('status.active'),
        value: 'ACTIVE'
      },
      {
        name: this.translate.instant('status.suspended'),
        value: 'SUSPENDED'
      }
    ];
  }

  openModal(): void {
    const ref = this.dialog.open(NewClientComponent, {
      dismissableMask: true,
      closable: true,
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
          ...this.clientStore.snapshot.params,
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
          page: this.clientStore.snapshot.params.page,
          take: this.clientStore.snapshot.params.take
        }
      });
      this.searchTerms = [];
    }
    
    if(this.nameSearch !== ''){
      this.clientStore.patchState({
        params: {
          ...this.clientStore.snapshot.params,
          name: this.nameSearch
        }
      });

      this.searchTerms.push(this.nameSearch);
    } 
    
    if(this.phoneSearch !== ''){
      this.clientStore.patchState({
        params: {
          ...this.clientStore.snapshot.params,
          phone_number: this.phoneSearch
        }
      });

      this.searchTerms.push(this.phoneSearch);
    } 
    
    if (this.statusSearch !== ''){
      this.clientStore.patchState({
        params: {
          ...this.clientStore.snapshot.params,
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
