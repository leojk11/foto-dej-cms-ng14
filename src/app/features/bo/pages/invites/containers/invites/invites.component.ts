import { RevealDirective } from 'src/app/shared/directives/reveal.directive';
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { InvitesStore } from '../../services/invites.store';
import { TableModule } from 'primeng/table';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ClientsService } from '../../../clients/services/clients.service';
import { Invite } from '../../models/invites.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import dayjs from 'dayjs';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';

export interface InviteFilter {
  client: string;
  date: string;
  status: string;
}

@Component({
    selector: 'app-invites',
    imports: [
        RevealDirective,
        CommonModule,
        TranslatePipe,
        TableModule,
        ButtonModule,
        TooltipModule,
        ConfirmDialogModule,
        FormsModule,
        InputTextModule,
        TooltipModule,
        DatePickerModule,
        PopoverModule,
        SelectModule
    ],
    providers: [
        ConfirmationService,
        InvitesStore
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './invites.component.html'
})
export class InvitesComponent implements OnInit {

  filters: InviteFilter = { } as InviteFilter;
  dateToFilter: Date | null = null;

  statuses: any[] = [];

  searchTerms: string[] = [];
  
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
    this.getInvites();
    this.adminLayoutService.setTitle('common.invites');
    this.translateStatuses();

    this.translate.onLangChange.subscribe( () => {
      this.translateStatuses();
    })
  }

  translateStatuses(): void {
    this.statuses = [
      {
        name: this.translate.instant('status.successful'),
        value: 'SUCCESSFULL'
      },
      {
        name: this.translate.instant('status.failed'),
        value: 'FAILED'
      }
    ];
  }
  
  getInvites(): void {
    this.invitesStore.setParams({ page: 1, take: 10 });
    this.invitesStore.getInvites(this.filters);
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
    this.filters = {} as InviteFilter;
    this.dateToFilter = null;
    this.searchTerms = [];
    this.getInvites()
  }

  openDatePicker(event: Event, datePicker: DatePicker): void {
    if ((event.target as HTMLElement).tagName === 'INPUT' && !datePicker.overlayVisible) {
      datePicker.showOverlay();
    }
  }

  onDateSelect(): void {
    this.filters.date = dayjs(this.dateToFilter).format('YYYY-MM-DD');
  }

  onDateClear(): void {
    this.filters.date = '';
    this.filter();
  }

  filter(): void {
    this.searchTerms = [];
    
    if (this.filters.client) {
      this.searchTerms.push(this.filters.client);
    }
    
    if (this.dateToFilter) {
      this.searchTerms.push(this.filters.date);
    }
    
    if (this.filters.status) {
      this.searchTerms.push(this.filters.status);
    }

    this.getInvites();
  }

  clearTerm(index: number): void {
    const term = this.searchTerms.splice(index, 1)[0];

    if (term === this.filters.client) {
      this.filters.client = ''
    }
    
    if (term === this.filters.date) {
      this.filters.date = ''
      this.dateToFilter = null;
    }
    
    if (term === this.filters.status) {
      this.filters.status = ''
    }

    this.getInvites();
  }
}
