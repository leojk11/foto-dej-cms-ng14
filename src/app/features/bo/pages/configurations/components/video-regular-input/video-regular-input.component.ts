import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-video-regular-input',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslatePipe,
        InputTextModule,
        ButtonModule,
        TooltipModule
    ],
    templateUrl: './video-regular-input.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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
