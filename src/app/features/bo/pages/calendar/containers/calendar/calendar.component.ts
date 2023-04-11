import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Calendar, CalendarOptions, FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { map, Observable, shareReplay } from 'rxjs';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CalendarService } from '../../services/calendar.service';
import * as dayjs from 'dayjs';
import { DialogService } from 'primeng/dynamicdialog';
import { AddNewScheduleComponent } from '../../components/add-new-schedule/add-new-schedule.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectDateComponent } from '../../components/select-date/select-date.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  listPlugin
]);

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FullCalendarModule,
    CalendarModule,
    FormsModule,
    InputTextModule,
    OverlayPanelModule
  ],
  providers: [
    DialogService
  ],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {

  @ViewChild('calendar') calendar!: FullCalendarComponent;

  showCalendar: boolean = true;
  modalWidth: string = '';

  events: any = [];

  filters: {
    title: string;
  } = {} as { date: string; title: string };

  initialDates: {
    from: string;
    to: string
  } = {} as { from: string; to: string };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next,prevYear,nextYear',
      right: 'title'
    },
    fixedWeekCount: false,
    eventClick: this.handleEventClick.bind(this),
    datesSet: this.handleDateChange.bind(this),
    dateClick: this.handleDateClick.bind(this),
    events: []
  };

  isMobile$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 878px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  mobile: boolean = false;

  constructor(
    private adminLayoutService: AdminLayoutService,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private calendarService: CalendarService,
    private dialog: DialogService,
    private translate: TranslateService,
    private toastService: ToastService,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.calendar');

    this.isMobile$.subscribe({
      next: (res: any) => {
        this.mobile = res;

        this.modalWidth = res ? '90%' : '50%';
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
    });
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
        this.toastService.addError(error.error.message);
      }
    });
  }

  handleDateClick(event: any): void {
    const dialogRef = this.dialog.open(AddNewScheduleComponent, {
      width: this.modalWidth,
      data: { date: event.date },
      header: this.translate.instant('calendar.newSchedule')
    });
    
    dialogRef.onClose.subscribe({
      next: () => {
        const event = {
          start: this.initialDates.from,
          end: this.initialDates.to
        };
        this.handleDateChange(event);
        
        this.cd.detectChanges();
      }
    });
  }

  handleEventClick({ event }: any): void {
    const dialogRef = this.dialog.open(AddNewScheduleComponent, {
      width: this.modalWidth,
      data: { id: event._def.publicId },
      
      header: this.translate.instant('calendar.editSchedule')
    });

    dialogRef.onClose.subscribe({
      next: () => {
        const event = {
          start: this.initialDates.from,
          end: this.initialDates.to
        };
        this.handleDateChange(event);
        
        this.cd.detectChanges();
      }
    });
  }

  openModal(): void {
    const dateDialogRef = this.dialog.open(SelectDateComponent, {
      width: this.modalWidth,
      header: this.translate.instant('common.chooseDate')
    });

    dateDialogRef.onClose.subscribe({
      next: (output) => {
        const dialogRef = this.dialog.open(AddNewScheduleComponent, {
          width: this.modalWidth,
          data: { date: output.date },
          header: this.translate.instant('calendar.newSchedule')
        });
        
        dialogRef.onClose.subscribe({
          next: () => {
            const event = {
              start: this.initialDates.from,
              end: this.initialDates.to
            };
            this.handleDateChange(event);
            
            this.cd.detectChanges();
          }
        });
      }
    });
  }

  filter(): void {
    this.calendarService.getAllSchedulesForUser({
      from: dayjs(this.initialDates.from).format('YYYY-MM-DD'),
      to: dayjs(this.initialDates.to).format('YYYY-MM-DD')
    }, this.filters).subscribe({
      next: res => {
        this.initialDates.from = dayjs(this.initialDates.from).format('YYYY-MM-DD');
        this.initialDates.to = dayjs(this.initialDates.to).format('YYYY-MM-DD');

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
        this.toastService.addError(error.error.message);
      }
    });
  }

  goToDate(): void {
    const dateDialogRef = this.dialog.open(SelectDateComponent, {
      width: this.modalWidth,
      header: this.translate.instant('common.chooseDate')
    });

    dateDialogRef.onClose.subscribe({
      next: data => {
        if (this.calendar) {
          const formattedDate = dayjs(data.date).format();
          console.log('formatted date', formattedDate);
          
          this.calendar.getApi().gotoDate(formattedDate);
          this.cd.detectChanges();
        }
      }
    });
  }

  clearFilter(): void {
    this.filters.title = '';
    this.filter();
  }
}
