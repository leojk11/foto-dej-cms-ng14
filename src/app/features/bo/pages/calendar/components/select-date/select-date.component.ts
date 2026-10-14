
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-select-date',
    templateUrl: './select-date.component.html',
    imports: [
    FormsModule,
    DatePickerModule,
    TranslatePipe,
    InputTextModule
],
    providers: [
        ConfirmationService
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./select-date.component.scss']
})
export class SelectDateComponent implements OnInit {

  selectedDate: string = '';
  finalSelectedDate: string = '';

  dateToOutpu: Date = new Date();

  constructor(
    public dialogRef: DynamicDialogRef,
  ) { }

  ngOnInit() {
  }

  onSelect(): void {
    const splitted = this.selectedDate.split('.');
    this.finalSelectedDate = `${ splitted[2] }-${ splitted[1] }-${ splitted[0] }T00:00:00`;

    this.dialogRef.close({ date: new Date(this.finalSelectedDate) });
  }
}
