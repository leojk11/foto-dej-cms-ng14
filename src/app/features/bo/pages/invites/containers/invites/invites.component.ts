import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { InvitesStore } from '../../services/invites.store';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ClientsService } from '../../../clients/services/clients.service';
import { Invite } from '../../models/invites.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invites',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  providers: [
    ConfirmationService,
  ],
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {

  constructor(
    public invitesStore: InvitesStore,
    private adminLayoutService: AdminLayoutService,
    private clientsService: ClientsService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private toastr: ToastrService
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
    this.confirmationService.confirm({
      key: 'invite',
      message: this.translate.instant('messages.inviteClient'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        this.clientsService.inviteClient(invite.invited_client_id).subscribe({
          next: res => {
            console.log('repeat invite res', res);
            this.toastr.success(res.message)
          },
          error: error => {
            // handle error
            console.log(error);
          }
        });
      }
    });
  }
}
