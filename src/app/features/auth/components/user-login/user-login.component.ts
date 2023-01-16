import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { APP_VERSION } from 'src/app/core/data/staticData';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import {InputTextModule} from 'primeng/inputtext';
import { DialogService } from 'primeng/dynamicdialog';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SpinnerComponent,
    InputTextModule
  ],
  providers: [
    DialogService
  ],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  @ViewChild('seePass') seePass!: ElementRef;
  @ViewChild('password') password!: ElementRef;

  appVersion = APP_VERSION;

  loginForm: FormGroup = this.formBuilder.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  selectedLang: string | null = '';

  loading: boolean = false;
  showPass: boolean = false;

  displayResetPassModal: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private dialog: DialogService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.selectedLang =  this.storageService.getItem('lang');
  }

  viewPassword(): void{
    this.showPass = !this.showPass;
    if(this.seePass && this.password){
      if(this.password.nativeElement.type === 'password'){
        this.password.nativeElement.type = 'text';
      }else {
        this.password.nativeElement.type = 'password';
      }
    }
  }

  changeLang(lang: string): void {
    this.translateService.use(lang).subscribe({
      next: ok => {
        console.log('OK TRANSLATION', ok);
      },
      error: err => {
        console.log('ERROR TRANSLATE SERVICE USE METHOD', err);
      }
    });

    this.storageService.setItem('lang', lang);
    this.selectedLang = this.storageService.getItem('lang')
  }

  login(): void {
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
          this.router.navigate(['/user/albums']).then();
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
      // height: '70%',
      header: this.translateService.instant('common.createNewPassowrd'),
      closable: false,
      data: userInfo
    });

    ref.onClose.subscribe({
      next: res => {
        console.log('res on close', res);
        this.authService.setAuthToken(res.token);
        this.authService.setUser(res.user);
        this.router.navigate(['/user/albums']).then();
      }
    })
  }
}