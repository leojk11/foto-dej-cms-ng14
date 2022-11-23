import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions, FullCalendarModule } from '@fullcalendar/angular';
import { map, Observable, shareReplay } from 'rxjs';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from 'src/app/core/services/auth.service';
import { CalendarService } from '../../services/calendar.service';
import * as dayjs from 'dayjs';
import { DialogService } from 'primeng/dynamicdialog';
import { AddNewScheduleComponent } from '../../components/add-new-schedule/add-new-schedule.component';
import { SharedModule } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FullCalendarModule,
    SpinnerComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  showCalendar: boolean = false;

  events: any = [];

  initialDates: {
    from: string;
    to: string
  } = {} as { from: string; to: string };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      right: 'title'
    },
    fixedWeekCount: false,
    eventClick: this.handleEventClick.bind(this),
    datesSet: this.handleDateChange.bind(this),
    // dateClick: this.handleDateClick.bind(this),
    events: []
  };

  isMobile$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 878px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private adminLayoutService: AdminLayoutService,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private calendarService: CalendarService,
    private dialog: DialogService
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.calendar');

    this.isMobile$.subscribe({
      next: res => {
        console.log('observer res', res);
        if (res) {
          this.showCalendar = false;
          this.calendarOptions.initialView = 'listMonth';

          setTimeout(() => {
            this.showCalendar = true;
            this.cd.detectChanges();
          }, 100);

          this.cd.detectChanges();
        } else {
          this.showCalendar = false;
          this.calendarOptions.initialView = 'dayGridMonth';

          setTimeout(() => {
            this.showCalendar = true;
            this.cd.detectChanges();
          }, 100);

          this.cd.detectChanges();
        }
      }
    })
  }

  handleDateChange(event: any): void {
    this.calendarService.getAllSchedulesForUser({
      from: dayjs(event.start).format('YYYY-MM-DD'),
      to: dayjs(event.end).format('YYYY-MM-DD')
    }).subscribe({
      next: res => {
        this.initialDates.from = dayjs(event.start).format('YYYY-MM-DD');
        this.initialDates.to = dayjs(event.end).format('YYYY-MM-DD');

        const events = [];
        for(const schedule of res) {
          events.push({
            title: `${ schedule.title } - ${ schedule.time }`,
            date: schedule.date,
            id: schedule.id
          });
        }
        this.events = events;

        this.calendarOptions = { ...this.calendarOptions, events }
        this.cd.detectChanges();

        this.showCalendar = true;
      },
      error: error => {
        // this.toast.error(error.error.message);
      }
    });
  }

  handleDateClick(event: any): void {
    const dialogRef = this.dialog.open(AddNewScheduleComponent, {
      width: '60%',
      data: { date: event.date }
    });
    
    // dialogRef.afterClosed().subscribe({
    //   next: () => {
    //     const event = {
    //       start: this.initialDates.from,
    //       end: this.initialDates.to
    //     };
    //     this.handleDateChange(event);
        
    //     this.cd.detectChanges();
    //   }
    // });
  }

  handleEventClick({ event }: any): void {
    const dialogRef = this.dialog.open(AddNewScheduleComponent, {
      width: '60%',
      data: { id: event._def.publicId }
    });

    // dialogRef.afterClosed().subscribe({
    //   next: () => {
    //     const event = {
    //       start: this.initialDates.from,
    //       end: this.initialDates.to
    //     };
    //     this.handleDateChange(event);
        
    //     this.cd.detectChanges();
    //   }
    // });
  }

}
