import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { Request } from '../../../requests/models/request.model';
import { DashboardStore } from '../../services/dashboard.store';
import { RevealDirective } from 'src/app/shared/directives/reveal.directive';

@Component({
    selector: 'app-dashboard-pending',
    imports: [
        CommonModule,
        TableModule,
        TranslatePipe,
        RevealDirective
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
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
