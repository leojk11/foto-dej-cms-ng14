import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    TranslateModule,
    InputTextModule
  ],
  providers: [
    ConfirmationService
  ],
  styleUrls: ['./select-date.component.css']
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
    console.log('selected date', this.selectedDate);
    
    const splitted = this.selectedDate.split('.');
    this.finalSelectedDate = `${ splitted[2] }-${ splitted[1] }-${ splitted[0] }T00:00:00`;

    this.dialogRef.close({ date: new Date(this.finalSelectedDate) });
  }
}
