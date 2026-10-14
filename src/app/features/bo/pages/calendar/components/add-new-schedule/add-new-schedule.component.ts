import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CalendarService } from '../../services/calendar.service';
import { Schedule } from '../../models/schedule.model';
import dayjs from 'dayjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Location } from '../../models/location.model';
import { TagModule } from 'primeng/tag';
import { AddNewLocationsComponent } from '../add-new-locations/add-new-locations.component';

@Component({
    selector: 'app-add-new-schedule',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslatePipe,
        SpinnerComponent,
        InputTextModule,
        TextareaModule,
        DialogModule,
        ConfirmDialogModule,
        TagModule
    ],
    providers: [
        ConfirmationService
    ],
    templateUrl: './add-new-schedule.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./add-new-schedule.component.scss']
})
export class AddNewScheduleComponent implements OnInit {

  @Output() onClose = new EventEmitter<any>();

  form: FormGroup = this.fb.group({
    date: ['', Validators.required],
    time: ['',],
    title: ['', Validators.required],
    description: [''],
    location_1: [''],
    location_2: [''],
    contact_number_1: [''],
    contact_number_2: ['']
  });

  editMode: boolean = false;
  loading: boolean = false;
  loadingLocations: boolean = false;

  selectedSchedule: Schedule | null = null;

  locations: Location[] = [];

  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private toastService: ToastService,
    private dialog: DialogService
  ) { }

  ngOnInit(): void {
    if (!!this.config.data) {
      if(this.config.data.date) {
        this.form.patchValue({
          date: dayjs(this.config.data.date).format('DD/MM/YYYY')
        });
      }

      if(this.config.data.id) {
        this.editMode = true;
        this.loading = true;

        this.calendarService.getSingleSchedule(this.config.data.id).subscribe({
          next: res => {
            this.selectedSchedule = res;

            this.form.patchValue({ 
              ...res,
              date: dayjs(new Date(res.date)).format('DD/MM/YYYY')
            });

            this.loading = false;

            this.getLocations();
          },
          error: error => {
            this.toastService.addError(error.error.message);
          }
        });
      }
    }
  }

  getLocations(): void {
    if (this.selectedSchedule)
    this.calendarService.getScheduleLocations(this.selectedSchedule.id).subscribe({
      next: locations => {
        this.locations = locations;
        this.loadingLocations = false;
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  handleSubmit(): void {
    const payload = { ...this.form.value };

    if (this.config.data.date) {
      payload.date = dayjs(new Date(this.config.data.date)).format('YYYY-MM-DD')
    }

    if(this.editMode) {
      if (this.selectedSchedule) {
        payload.date = dayjs(new Date(this.selectedSchedule.date)).format('YYYY-MM-DD');

        this.calendarService.updateSchedule(this.selectedSchedule.id, payload).subscribe({
          next: res => {
            this.toastService.addSuccess(res.message);
            this.dialogRef.close();
          },
          error: error => {
            this.toastService.addSuccess(error.error.message);
          }
        });
      }
    } else {
      this.calendarService.addNewSchedule(payload).subscribe({
        next: res => {
          this.toastService.addSuccess(res.message);
          this.dialogRef.close();
        },
        error: error => {
          this.toastService.addError(error.error.message);
        }
      });
    }
  }

  handleDelete(): void {
    if(this.config.data.id) {
      this.confirmationService.confirm({
        message: this.translate.instant('messages.deleteSchedule'),
        acceptButtonStyleClass: 'btn btn__red text',
        rejectButtonStyleClass: 'btn btn__dark text',
        acceptLabel: this.translate.instant('common.yes'),
        rejectLabel: this.translate.instant('common.no'),
        accept: () => {
          this.calendarService.deleteSchedule(this.config.data.id).subscribe({
            next: res => {
              this.toastService.addSuccess(res.message);
              this.dialogRef.close();
            },
            error: error => {
              this.toastService.addError(error.error.message);
            }
          });
        }
      });
    }
  }

  locationDialog(location?: Location): void {
    const dialogRef = this.dialog.open(AddNewLocationsComponent, {
      dismissableMask: true,
      closable: true,
      width: '50%',
      data: { 
        scheduleId: this.selectedSchedule?.id,
        location
      },
      header: location ? this.translate.instant('calendar.editLocation')  : this.translate.instant('calendar.newLocation')
    });
    
    dialogRef?.onClose.subscribe({
      next: (data) => {
        if (data) {
          this.getLocations();
        }
      }
    });
  }
}
