import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ButtonModule } from 'primeng/button';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStore } from '../../services/dashboard.store';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DashboardCardComponent,
    TranslateModule
  ],
  providers: [DashboardStore],
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
