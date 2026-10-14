import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Client } from 'src/app/features/bo/pages/clients/models/client.model';
import { ClientsService } from 'src/app/features/bo/pages/clients/services/clients.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ClientsStore } from 'src/app/features/bo/pages/clients/services/clients.store';

@Component({
    selector: 'app-assign-album',
    imports: [
    TranslatePipe
],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './assign-album.component.html'
})
export class AssignAlbumComponent implements OnInit {

  @Input() client: Client | null = null;
  @Output() clientSelected = new EventEmitter<Client>();
  @Output() close = new EventEmitter();

  selectedClient: Client = {} as Client;
  clients: Client[] = [];
  loading: boolean = true;

  constructor(
    private clientService: ClientsService,
    private clientStore: ClientsStore
  ) { }

  ngOnInit(): void {
    if(this.client){
      this.selectedClient = this.client
    }
    
    this.getClients();
  }

  getClients(): void {
    this.clientStore.getAllClients();
  }

  selectClient(client: Client): void {
    this.clientSelected.emit(client);
  }

  onCloseModal(): void {
    this.close.emit()
  }

}
