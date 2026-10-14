import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-regular-input-double',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslatePipe,
        InputTextModule
    ],
    templateUrl: './regular-input-double.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./regular-input-double.component.scss']
})
export class RegularInputDoubleComponent implements OnInit {

  @Input() form: FormGroup = new FormGroup({ });
  @Input() controlName: string = '';
  @Input() secondFormControlName: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() message: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
