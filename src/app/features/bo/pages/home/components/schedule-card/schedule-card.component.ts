import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Schedule } from '../../../calendar/models/schedule.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-schedule-card',
    imports: [
    TranslatePipe
],
    changeDetection: ChangeDetectionStrategy.Eager,
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
