import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { APP_VERSION } from 'src/app/core/data/staticData';
import { AuthService } from 'src/app/core/services/auth.service';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { TranslatePipe } from '@ngx-translate/core';
import { PopoverModule } from 'primeng/popover';
import { NotificationComponent } from 'src/app/features/bo/pages/notifications/components/notification/notification.component';
import { NotificationStore } from '../../../pages/notifications/services/notification.store';
import { RouterModule } from '@angular/router';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
    selector: 'app-navbar',
    imports: [
        CommonModule,
        TranslatePipe,
        PopoverModule,
        NotificationComponent,
        RouterModule,
        OverlayBadgeModule
    ],
    providers: [NotificationStore],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  appVersion = APP_VERSION;
  @Input() showToggle: boolean = false;
  @Input() isMobile: boolean = false;

  @Output() toggleSidebar = new EventEmitter();

  constructor(
    public authService: AuthService,
    public adminLayoutService: AdminLayoutService,
    public location: Location,
    public notificationStore: NotificationStore
  ) { }

  ngOnInit(): void {
    console.log('USER', this.authService.user);
    this.notificationStore.loadNotifications();
  }

  logout(): void {
    this.authService.boLogout();
  }

}
