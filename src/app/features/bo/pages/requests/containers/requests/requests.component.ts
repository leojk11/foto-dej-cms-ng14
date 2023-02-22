import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { RequestsStore } from '../../services/requests.store';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RequestFilters } from '../../models/requestFilters.model';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    FormsModule,
    InputTextModule,
    OverlayPanelModule
  ],
  providers: [
    RequestsStore
  ],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  filters: RequestFilters = {} as RequestFilters;

  constructor(
    private adminLayoutService: AdminLayoutService,
    public requestsStore: RequestsStore,
    public location: Location
  ) { }

  ngOnInit() {
    this.requestsStore.getRequests();
    this.adminLayoutService.setTitle('common.requests');
  }

  onLazyLoad(event: any): void {
    this.requestsStore.setParams({ page: event.first + 1, take: event.rows });
    this.requestsStore.getRequests();
  }

  filter(): void {
    this.requestsStore.setParams({ page: 1, take: 10 });
    this.requestsStore.getRequests(this.filters);
  }

  clearFilter(): void {
    
  }
}
