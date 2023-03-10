import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { InvitesStore } from '../../services/invites.store';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ClientsService } from '../../../clients/services/clients.service';
import { Invite } from '../../models/invites.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import * as dayjs from 'dayjs';
import { OverlayPanelModule } from 'primeng/overlaypanel';

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
    FormsModule,
    InputTextModule,
    TooltipModule,
    CalendarModule,
    OverlayPanelModule
  ],
  providers: [
    ConfirmationService,
    InvitesStore
  ],
  templateUrl: './invites.component.html'
})
export class InvitesComponent implements OnInit {

  filters: {
    client: string;
    date: string;
  } = { } as { client: string, date: string };
  dateToFilter: Date | null = null;

  constructor(
    public invitesStore: InvitesStore,
    private adminLayoutService: AdminLayoutService,
    private clientsService: ClientsService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private toastService: ToastService,
    public location: Location
  ) { }

  ngOnInit() {
    this.invitesStore.getInvites();
    this.adminLayoutService.setTitle('common.invites');
  }

  onLazyLoad(event: any): void {
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
            this.toastService.addSuccess(res.message);

            this.invitesStore.setParams({ page: 1, take: 9 });
            this.invitesStore.getInvites();
          },
          error: error => {
            this.toastService.addError(error.error.message);
          }
        });
      }
    });
  }

  refresh(): void {
    this.filters = {} as { client: string; date: string };
    this.dateToFilter = null;
    this.invitesStore.setParams({ page: 1, take: 10 });
    this.invitesStore.getInvites();
  }

  onDateSelect(): void {
    this.filters.date = dayjs(this.dateToFilter).format('YYYY-MM-DD');
  }
  onDateClear(): void {
    this.filters.date = '';
    this.filter();
  }

  filter(): void {
    this.invitesStore.setParams({ page: 1, take: 10 });
    this.invitesStore.getInvites(this.filters);
  }

  clearFilter(): void {
    
  }

}
