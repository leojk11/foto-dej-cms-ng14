import { RevealDirective } from 'src/app/shared/directives/reveal.directive';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { NotificationStore } from '../../services/notification.store';
import { NotificationComponent } from '../../components/notification/notification.component';
import { PaginatorModule } from 'primeng/paginator';
import { NotificationService } from '../../services/notification.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-notifications',
    imports: [
        RevealDirective,
        CommonModule,
        TranslatePipe,
        NotificationComponent,
        PaginatorModule
    ],
    providers: [NotificationStore],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {


  constructor(
    public location: Location,
    public notificationStore: NotificationStore,
    private adminLayoutService: AdminLayoutService,
    private service: NotificationService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.notifications');

    this.notificationStore.setParams({
      page: 1,
      take: 9
    });

    this.notificationStore.loadNotifications();
  }

  onPageChange(event: any): void {
    console.log('PAGE', event.page + 1);
    
    this.notificationStore.setParams({page: event.page + 1, take: 9});
    this.notificationStore.loadNotifications();
  }

  markAllRead(): void {
    this.service.markAllRead().subscribe({
      next: res => {
        console.log('MARK ALL READ RES', res);
        this.toastService.addSuccess(res.message);
      }, 
      error: err => {
        console.error(err);
        this.toastService.addError(err)
      }
    });
  }

}
