import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-regular-input',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslatePipe,
        InputTextModule
    ],
    templateUrl: './regular-input.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./regular-input.component.scss']
})
export class RegularInputComponent implements OnInit {

  @Input() form: FormGroup = {} as FormGroup;
  @Input() controlName: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
