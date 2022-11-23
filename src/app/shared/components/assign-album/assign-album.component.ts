import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from 'src/app/features/bo/pages/clients/models/client.model';
import { ClientsService } from 'src/app/features/bo/pages/clients/services/clients.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-assign-album',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './assign-album.component.html',
  styleUrls: ['./assign-album.component.scss']
})
export class AssignAlbumComponent implements OnInit {

  @Input() client: Client | null = null;
  @Output() clientSelected = new EventEmitter<Client>();
  @Output() close = new EventEmitter();

  selectedClient: Client = {} as Client;
  clients: Client[] = [];
  loading: boolean = true;

  constructor(
    private clientService: ClientsService
  ) { }

  ngOnInit(): void {
    if(this.client){
      this.selectedClient = this.client
    }
    console.log('SELECTED CLIENT', this.selectedClient);
    
    this.getClients();
  }

  getClients(): void {
    this.clientService.getAllCLients({page: 1, take: 10}).subscribe({
      next: res => {
        this.clients = res.list;
        console.log('Clients', this.clients);
        this.loading = !this.loading;
      }
    });
  }

  selectClient(client: Client): void {
    this.clientSelected.emit(client);
  }

  onCloseModal(): void {
    this.close.emit()
  }

}
