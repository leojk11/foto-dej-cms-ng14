import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LogStore } from '../../services/log.store';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { LogComponent } from 'src/app/shared/components/log/log.component';
import { LogFilter } from '../../models/log-filter.model';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import * as dayjs from 'dayjs';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    TranslateModule,
    LogComponent,
    OverlayPanelModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    PaginatorModule
  ],
  providers: [ LogStore ],
  templateUrl: './logs.component.html'
})
export class LogsComponent implements OnInit {

  searchTerms: string[] = [];
  dateSearch: Date | null = null;
  filters: LogFilter = {} as LogFilter;

  actions: any[] = [];

  constructor(
    public logStore: LogStore,
    public location: Location,
    private adminLayoutService: AdminLayoutService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.logs')
    this.logStore.getAllLogs();
    this.translateActions();

    this.translate.onLangChange.subscribe({
      next: () => {
        this.translateActions();
      }
    });
  }

  translateActions(): void {
    this.actions = [
      {
        name: this.translate.instant('status.login'),
        value: 'LOGIN'
      },
      {
        name: this.translate.instant('status.logout'),
        value: 'LOGOUT'
      },
      {
        name: this.translate.instant('status.accountActivation'),
        value: 'ACTIVATE_ACCOUNT'
      },
      {
        name: this.translate.instant('status.selectedImages'),
        value: 'SELECTED_IMAGES'
      },
      {
        name: this.translate.instant('status.updatedProfile'),
        value: 'UPDATED_PROFILE'
      }
    ];
  }

  onDateSelect(): void {
    this.filters.date = dayjs(this.dateSearch).format('YYYY-MM-DD');
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
    
    if (this.filters.action) {
      this.searchTerms.push(this.filters.action);
    }
    
    if (this.filters.date) {
      this.searchTerms.push(this.filters.date);
    }

    this.logStore.getAllLogs(this.filters);
  }

  clearFilter(): void {
    this.filters = {} as LogFilter;
    this.dateSearch = null;
    this.searchTerms = [];
    this.logStore.getAllLogs();
  }

  clearTerm(index: number): void {
    const term = this.searchTerms.splice(index, 1)[0];

    if (term === this.filters.client) {
      this.filters.client = '';
    }
    
    if (term === this.filters.action) {
      this.filters.action = '';
    }
    
    if (term === this.filters.date) {
      this.filters.date = '';
    }

    this.filter();
  }

  onPageChange(event: any): void {
    this.logStore.patchParams(event.page + 1);
    this.logStore.getAllLogs();
  }
}
