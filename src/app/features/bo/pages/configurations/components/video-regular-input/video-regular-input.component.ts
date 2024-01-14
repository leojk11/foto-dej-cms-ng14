import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-video-regular-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './video-regular-input.component.html',
  styleUrls: ['./video-regular-input.component.scss']
})
export class VideoRegularInputComponent implements OnInit {

  @Input() form: FormGroup = {} as FormGroup;
  @Input() controlName: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';

  @Input() id: string = '';
  @Input() preview: boolean = false;

  @Output() onSave = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void {
  }

  get elements() {
    return this.form.get(this.id) as FormArray;
  }

  addElement(): void {
    this.elements.push(new FormControl());
  }

  delete(index: number): void {
    this.elements.removeAt(index);
  }

  togglePreview(index: number): void {
    window.open(this.elements.controls[index].value, "_blank");
  }
}
