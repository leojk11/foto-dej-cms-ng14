import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { InvitesStore } from '../../services/invites.store';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ClientsService } from '../../../clients/services/clients.service';
import { Invite } from '../../models/invites.model';

@Component({
  selector: 'app-invites',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css']
})
export class InvitesComponent implements OnInit {

  constructor(
    public invitesStore: InvitesStore,
    private adminLayoutService: AdminLayoutService,
    private clientsService: ClientsService
  ) { }

  ngOnInit() {
    this.invitesStore.getInvites();
    this.adminLayoutService.setTitle('common.invites');
  }

  onLazyLoad(event: any): void {
    console.log(event);
    this.invitesStore.setParams({ page: event.first + 1, take: event.rows });
    this.invitesStore.getInvites();
  }

  resendInvite(invite: Invite): void {
    this.clientsService.inviteClient(invite.invited_client_id).subscribe({
      next: res => {
        console.log('repeat invite res', res);
        
      },
      error: error => {
        // handle error
        console.log(error);
      }
    });
  }

}
