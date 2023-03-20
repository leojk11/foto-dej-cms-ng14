import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit {

  @Input() notification: any;

  constructor() { }

  ngOnInit(): void {
  }

}
