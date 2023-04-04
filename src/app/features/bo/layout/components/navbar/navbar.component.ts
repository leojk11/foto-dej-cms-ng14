import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { APP_VERSION } from 'src/app/core/data/staticData';
import { AuthService } from 'src/app/core/services/auth.service';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NotificationComponent } from 'src/app/features/bo/pages/notifications/components/notification/notification.component';
import { NotificationStore } from '../../../pages/notifications/services/notification.store';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule,
    OverlayPanelModule,
    NotificationComponent,
    RouterModule,
    BadgeModule
  ],
  providers: [NotificationStore],
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
