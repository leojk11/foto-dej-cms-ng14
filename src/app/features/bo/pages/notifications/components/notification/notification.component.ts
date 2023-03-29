import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit {

  selectedLang: string = '';

  @Input() notification: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.selectedLang = localStorage.getItem('lang')!;
  }

  onNotificationClick(): void {
    if( this.notification.type === 'REQUEST_SENT' )
      this.router.navigate(['/bo/requests']).then();
  }

}
