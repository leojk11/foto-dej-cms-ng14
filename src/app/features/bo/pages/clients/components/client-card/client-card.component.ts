import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../models/client.model';
import { ClientsStore } from '../../services/clients.store';
import { NewClientComponent } from '../../containers/new-client/new-client.component';
import { DialogService } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit {

  @Input() client: Client = {} as Client;
  @Output() clientUpdated = new EventEmitter();

  constructor(
    private clientStore: ClientsStore,
    private dialog: DialogService
  ) { }

  ngOnInit(): void {
  }

  openEditModal(client: Client): void {
    const ref = this.dialog.open(NewClientComponent, {
      width: '45%',
      height: '65%',
      data: client,
      showHeader: false
    });

    ref.onClose.subscribe({
      next: res => {
        if(res === 'update'){
          this.clientUpdated.emit();
        }
      }
    })
  }

  deleteClient(client: Client): void {
    this.clientStore.deleteClient(client);
  }
}
