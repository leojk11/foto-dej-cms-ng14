import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    TranslateModule
  ],
  providers: [
    DialogService
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  userInfo: { 
    id: string;
    first_password: string;
  } = {} as { 
    id: string;
    first_password: string;
  };
  firstPassword: string = '';

  form: FormGroup = this.fb.group({
    first_password: [''],
    password: ['', Validators.required],
    repeat_password: ['', Validators.required]
  });

  constructor(
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private dialog: DialogService,
    private translate: TranslateService,
    public dialogRef: DynamicDialogRef,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    console.log('config data', this.config.data);
    
    if (this.config.data) {
      this.userInfo = this.config.data;
    }
  }

  handleSubmit(): void {
    this.form.patchValue({
      first_password: this.userInfo.first_password
    });

    this.authService.resetUserPassword(this.userInfo.id, this.form.value).subscribe({
      next: res => {
        this.dialogRef.close(res);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }
}
