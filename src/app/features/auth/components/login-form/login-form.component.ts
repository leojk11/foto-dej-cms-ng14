import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';
import { FrontConfigurationService } from 'src/app/shared/services/front-configuration.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { DialogService } from 'primeng/dynamicdialog';
import { LangChangeComponent } from 'src/app/shared/components/lang-change/lang-change.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    LangChangeComponent
  ],
  providers: [DialogService],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent implements OnInit {

  @Input() isAdmin: boolean = false;

  loginForm: FormGroup = this.formBuilder.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private frontConfigService: FrontConfigurationService,
    private router: Router,
    public frontConfigState: FrontConfigurationState,
    private toastService: ToastService,
    private dialog: DialogService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.frontConfigService.getConfiguration().subscribe({
      next: res => {
        this.frontConfigState.setConfiguration(res);
      },
      error: error => {
        this.toastService.addError(error);
      }
    });
  }

  onLogin(): void {
    this.isAdmin ? this.loginAdmin() : this.clientLogin();
  }

  loginAdmin(): void {
    this.loading = true;
    console.log('ADMIN LOGIN');
    

    this.authService.adminLogin(this.loginForm.value).subscribe({
      next: res => {
        this.authService.setBoAuthToken(res.token);
        this.authService.setBoUser(res.user);
        this.router.navigate(['/bo/dashboard'])
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.loading = false;
      }
    });
  }

  clientLogin(): void {
    this.loading = true;
    
    this.authService.userLogin(this.loginForm.value).subscribe({
      next: res => {
        if (res.command) {
          if(res.command === 'RESET_REQUIRED') {
            this.openModal(res.user_info);
          }
        } else {
          this.authService.setAuthToken(res.token);
          this.authService.setUser(res.user);
          this.router.navigate(['/client/albums']).then();
        }
      },
      error: error => {
        this.loading = false;
        this.toastService.addError(error.error.message);
      }
    });
  }

  openModal(userInfo: {
    id: string;
    first_password: string;
  }): void {
    const ref = this.dialog.open(ResetPasswordComponent, {
      width: '50vw',
      header: this.translateService.instant('common.createNewPassowrd'),
      closable: false,
      data: userInfo
    });

    ref.onClose.subscribe({
      next: res => {
        console.log('res on close', res);
        this.authService.setAuthToken(res.token);
        this.authService.setUser(res.user);
        this.router.navigate(['/client/albums']).then();
      }
    })
  }
}
