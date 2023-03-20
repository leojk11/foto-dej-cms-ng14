import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Schedule } from '../../../calendar/models/schedule.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-schedule-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './schedule-card.component.html'
})
export class ScheduleCardComponent implements OnInit {

  @Input() event: Schedule = {} as Schedule;
  date: any;

  constructor() { }

  ngOnInit(): void {
    if(this.event) {
      this.date = new Date(this.event.date).toDateString().split(' ');
    }
  }

}
