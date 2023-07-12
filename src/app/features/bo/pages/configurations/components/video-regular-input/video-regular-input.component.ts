import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-video-regular-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './video-regular-input.component.html',
  styleUrls: ['./video-regular-input.component.scss']
})
export class VideoRegularInputComponent implements OnInit {

  @Input() form: FormGroup = {} as FormGroup;
  @Input() controlName: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
