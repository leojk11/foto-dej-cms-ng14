import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { RequestsStore } from '../../services/requests.store';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule
  ],
  providers: [
    RequestsStore
  ],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  constructor(
    private adminLayoutService: AdminLayoutService,
    public requestsStore: RequestsStore
  ) { }

  ngOnInit() {
    this.requestsStore.getRequests();
    this.adminLayoutService.setTitle('common.requests');
  }

  onLazyLoad(event: any): void {
    this.requestsStore.setParams({ page: event.first + 1, take: event.rows });
    this.requestsStore.getRequests();
  }


}
