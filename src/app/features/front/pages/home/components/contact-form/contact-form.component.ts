import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { FrontConfigurationService } from '../../../../../../shared/services/front-configuration.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule
  ],
  templateUrl: './contact-form.component.html'
})
export class ContactFormComponent implements OnInit {

  contactForm: FormGroup = this.fb.nonNullable.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    phone_number: ['', Validators.required],
    email: ['']
  })

  constructor(
    private fb: FormBuilder,
    private service: FrontConfigurationService,
    private toast: ToastService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    this.spinner.show().then();
    this.service.sendRequest(this.contactForm.value).subscribe({
      next: res => {
        console.log('REQUEST RES', res);
        this.toast.addSuccess(res.message);
        this.contactForm.reset();
        this.spinner.hide().then();
      }, 
      error: err => {
        this.toast.addError(err.message);
        this.spinner.hide().then();
      }
    });
  }

}
