import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    TranslateModule
  ],
  providers: [
    ConfirmationService
  ],
  styleUrls: ['./select-date.component.css']
})
export class SelectDateComponent implements OnInit {

  selectedDate: Date = new Date();

  constructor(
    public dialogRef: DynamicDialogRef,
  ) { }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogRef.close({date: this.selectedDate})
  }

}
