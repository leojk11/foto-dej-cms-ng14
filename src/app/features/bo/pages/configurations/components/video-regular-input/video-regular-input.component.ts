import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

// An editable list of text values (videos, notification emails) backed by a FormArray.
@Component({
    selector: 'app-video-regular-input',
    imports: [
        LowerCasePipe,
        ReactiveFormsModule,
        TranslatePipe,
        InputTextModule,
        TooltipModule
    ],
    templateUrl: './video-regular-input.component.html',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class VideoRegularInputComponent {

  @Input() form: FormGroup = {} as FormGroup;
  @Input() label: string = '';
  @Input() placeholder: string = '';

  @Input() id: string = '';
  @Input() preview: boolean = false;

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
    window.open(this.elements.controls[index].value, '_blank');
  }
}
