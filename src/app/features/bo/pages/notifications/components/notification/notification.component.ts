import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-notification',
    imports: [
        CommonModule,
        TranslatePipe
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit {

  selectedLang: string = '';

  @Input() notification: any;

  constructor(
    private router: Router,
    private service: NotificationService
  ) { }

  ngOnInit(): void {
    this.selectedLang = localStorage.getItem('lang')!;
  }

  onNotificationClick(id: string): void {
    if(this.notification.read) {
      this.navigateNotification(id);
    } else {
      this.service.markRead(id).subscribe({
        next: res => {
          console.log('MARK READ RES', res);
          this.navigateNotification(id);
        },
        error: err => {
          console.error('ERR', err); 
        }
      });
    }
  }

  navigateNotification(id: string): void {
    if( this.notification.type === 'REQUEST_SENT' )
      this.router.navigate(['/bo/requests']).then();

    if( this.notification.type === 'SELECTED_IMAGES' ) {
      if(this.notification.album_id)
      this.router.navigate([`bo/albums/${this.notification.album_id}`]);
    }
  }

}
