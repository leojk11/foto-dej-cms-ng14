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
    console.log('EVENT', this.event);
    
    if(this.event) {
      console.log('DATE MONT', new Date(this.event.date).getMonth())
      console.log('DATE', new Date(this.event.date).toDateString().split(' '))
      this.date = new Date(this.event.date).toDateString().split(' ');
    }
  }

}
