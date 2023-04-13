import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-regular-input-double',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule
  ],
  templateUrl: './regular-input-double.component.html',
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
