import { RevealDirective } from 'src/app/shared/directives/reveal.directive';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { APP_VERSION } from 'src/app/core/data/staticData';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import {InputTextModule} from 'primeng/inputtext';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LangChangeComponent } from 'src/app/shared/components/lang-change/lang-change.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-bo-login',
    imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    SpinnerComponent,
    InputTextModule,
    LoginFormComponent,
    LangChangeComponent,
        RevealDirective
],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './bo-login.component.html'
})
export class BoLoginComponent implements OnInit, AfterViewInit {

  appVersion = APP_VERSION;

  loginForm: FormGroup = this.formBuilder.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  selectedLang: string | null = '';

  loading: boolean = false;

  showPass: boolean = false;

  @ViewChild('seePass') seePass!: ElementRef;
  @ViewChild('password') password!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.selectedLang =  this.storageService.getItem('lang');
    this.spinner.show().then();
  }

  ngAfterViewInit(): void {
    this.spinner.hide().then();
  }

  viewPassword(): void{
    this.showPass = !this.showPass;

    if(this.seePass && this.password){
      if(this.password.nativeElement.type === 'password'){
        this.password.nativeElement.type = 'text';
      } else {
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

  loginAdmin(): void {
    this.loading = true;

    this.authService.adminLogin(this.loginForm.value).subscribe({
      next: res => {
        this.authService.setBoAuthToken(res.token);
        this.authService.setBoUser(res.user);
        this.router.navigate(['/bo/dashboard'])
      },
      error: error => {
        // this.toast.error(error.error.message);
        this.loading = false;
      }
    })
  }

}