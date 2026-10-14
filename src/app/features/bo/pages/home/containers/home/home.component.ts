import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ButtonModule } from 'primeng/button';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStore } from '../../services/dashboard.store';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DashboardPendingComponent } from '../../components/dashboard-pending/dashboard-pending.component';
import { ScheduleCardComponent } from '../../components/schedule-card/schedule-card.component';
import { RevealDirective } from 'src/app/shared/directives/reveal.directive';

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        ButtonModule,
        DashboardCardComponent,
        TranslatePipe,
        DashboardPendingComponent,
        ScheduleCardComponent,
        RevealDirective
    ],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(
    private adminLayoutService: AdminLayoutService,
    private toastService: ToastService,
    public dashboardStore: DashboardStore
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.home');
    this.dashboardStore.loadData();
  }

  testService(): void {
    this.toastService.addError('test');
  }

}
