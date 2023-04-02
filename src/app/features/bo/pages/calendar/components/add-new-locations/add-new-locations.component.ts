import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarService } from '../../services/calendar.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Location } from '../../models/location.model';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-add-new-locations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SpinnerComponent,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './add-new-locations.component.html',
  styleUrls: ['./add-new-locations.component.scss']
})
export class AddNewLocationsComponent implements OnInit {

  form: FormGroup = this.fb.group({
    title: [null, Validators.required],
    place: [null],
    time: [null, Validators.required]
  });

  scheduleId: string = '';
  selectedLocation: Location = {} as Location;

  loading: boolean = false;
  editMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private calendarService: CalendarService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (!!this.config.data) {
      if (this.config.data.scheduleId) {
        this.scheduleId = this.config.data.scheduleId;
      }

      if (this.config.data.location) {
        this.editMode = true;
        this.selectedLocation = this.config.data.location;
        this.form.patchValue({ ...this.selectedLocation });
      }
    }
  }

  handleSubmit(): void {
    if (this.editMode) {
      this.calendarService.updateLocation(this.scheduleId, this.selectedLocation.id, this.form.value).subscribe({
        next: res => {
          this.dialogRef.close(true);
        },
        error: error => {
          this.toastService.addError(error.error.message);
        }
      });
    } else {
      this.calendarService.addNewLocation(this.scheduleId, this.form.value).subscribe({
        next: res => {
          this.dialogRef.close(true);
        },
        error: error => {
          this.toastService.addError(error.error.message);
        }
      });
    }
  }

  handleDelete(): void {
    if(this.editMode) {
      this.confirmationService.confirm({
        message: this.translateService.instant('messages.deleteLocation'),
        acceptButtonStyleClass: 'btn btn__red text',
        rejectButtonStyleClass: 'btn btn__dark text',
        acceptLabel: this.translateService.instant('common.yes'),
        rejectLabel: this.translateService.instant('common.no'),
        accept: () => {
          this.calendarService.deleteLocation(this.scheduleId, this.selectedLocation.id).subscribe({
            next: () => {
              this.dialogRef.close(true);
            },
            error: error => {
              this.toastService.addError(error.error.message);
            }
          })
        }
      });
    }
  }

}
