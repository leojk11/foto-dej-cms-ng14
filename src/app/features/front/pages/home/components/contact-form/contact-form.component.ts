import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { FrontConfigurationService } from '../../services/front-configuration.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
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
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    this.service.sendRequest(this.contactForm.value).subscribe({
      next: res => {
        console.log('REQUEST RES', res);
        this.toast.addSuccess(res.message);
      }, 
      error: err => {
        // console.error('REQUEST ERR', err);
        this.toast.addError(err.message);
      }
    })
  }

}
