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

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SpinnerComponent
  ],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  appVersion = APP_VERSION;

  loginForm: FormGroup = this.formBuilder.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  selectedLang: string | null = '';

  loading: boolean = false;

  @ViewChild('seePass') seePass!: ElementRef;
  @ViewChild('password') password!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.selectedLang =  this.storageService.getItem('lang');
  }

  viewPassword(): void{
    if(this.seePass && this.password){
      if(this.password.nativeElement.type === 'password'){
        this.password.nativeElement.type = 'text';
        this.seePass.nativeElement.innerText = 'visibility_off'
      }else {
        this.password.nativeElement.type = 'password';
        this.seePass.nativeElement.innerText = 'visibility'
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

    this.authService.adminLogin(this.loginForm.value).subscribe({
      next: res => {
        this.authService.setAuthToken(res.token);
        this.authService.setUser(res.user);
        this.router.navigate(['/home'])
      },
      error: error => {
        this.loading = false;
        // this.toast.error(error.error.message);
      }
    })
  }
}