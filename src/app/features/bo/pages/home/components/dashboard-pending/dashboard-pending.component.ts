import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { Request } from '../../../requests/models/request.model';
import { DashboardStore } from '../../services/dashboard.store';

@Component({
  selector: 'app-dashboard-pending',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TranslateModule
  ],
  templateUrl: './dashboard-pending.component.html'
})
export class DashboardPendingComponent implements OnInit {

  @Input() requests: Request[] = [];

  constructor(
    private dashboardStore: DashboardStore
  ) { }

  ngOnInit(): void {
  }

  onLazyLoad(event: any): void {
  }

}
