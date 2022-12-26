import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CalendarService } from '../../services/calendar.service';
import { Schedule } from '../../models/schedule.model';
import * as dayjs from 'dayjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { InputTextModule } from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-add-new-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SpinnerComponent,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './add-new-schedule.component.html',
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

  selectedSchedule: Schedule | null = null;

  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
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
            console.log('single schedule', res);
            
            this.selectedSchedule = res;

            this.form.patchValue({ 
              ...res,
              date: dayjs(new Date(res.date)).format('DD/MM/YYYY')
            });

            this.loading = false;
          },
          error: error => {
            // this.toast.error(error.error.message);
          }
        });
      }
    }
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
            // this.toast.success(res.message);
            this.dialogRef.close();
          },
          error: error => {
            // this.toast.success(error.error.message);
          }
        });
      }
    } else {
      this.calendarService.addNewSchedule(payload).subscribe({
        next: res => {
          // this.toast.success(res.message);
          this.dialogRef.close();
        },
        error: error => {
          // this.toast.error(error.error.message);
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
        accept: () => {
          this.calendarService.deleteSchedule(this.config.data.id).subscribe({
            next: res => {
              // this.toast.success(res.message);
              this.dialogRef.close();
            },
            error: error => {
              // this.toast.error(error.error.message);
            }
          });
        }
      });
    }
  }
}
