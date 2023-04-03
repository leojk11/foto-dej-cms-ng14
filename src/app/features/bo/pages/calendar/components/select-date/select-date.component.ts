import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import * as dayjs from 'dayjs';
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

  dateToOutpu: Date = new Date();

  constructor(
    public dialogRef: DynamicDialogRef,
  ) { }

  ngOnInit() {
  }

  onSelect(): void {
    console.log('selected date', this.selectedDate);
    
    console.log('chosen date', dayjs(this.selectedDate + 'T00:00:00').format());
    
  }

  onClose(): void {
    this.dialogRef.close({date: this.selectedDate})
  }

}
