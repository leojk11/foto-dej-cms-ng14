import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../models/client.model';
import { ClientsStore } from '../../services/clients.store';
import { NewClientComponent } from '../../containers/new-client/new-client.component';
import { DialogService } from 'primeng/dynamicdialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogModule,
    TranslateModule,
    RouterModule
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit {

  @Input() client: Client = {} as Client;
  @Output() clientUpdated = new EventEmitter();

  constructor(
    private clientStore: ClientsStore,
    private dialog: DialogService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

  openEditModal(): void {
    const ref = this.dialog.open(NewClientComponent, {
      width: '90%',
      // height: '65%',
      data: this.client,
      header: this.translate.instant('clients.editClient')
    });

    ref.onClose.subscribe({
      next: res => {
        if(res === 'update'){
          this.clientUpdated.emit();
        }
      }
    })
  }

  deleteClient(event: any): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      key: 'delete',
      message: this.translate.instant('messages.deleteClient'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        this.clientStore.deleteClient(this.client);
      }
    });
  }

  sendInvite(event: any): void {
    event.stopPropagation();
    
    this.confirmationService.confirm({
      key: 'invite',
      message: this.translate.instant('messages.inviteClient'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        this.clientStore.inviteClient(this.client.id);
      }
    });
  }
}
