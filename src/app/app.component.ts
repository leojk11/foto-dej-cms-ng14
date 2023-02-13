import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OnlineStatusModule, OnlineStatusService } from 'ngx-online-status';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/services/auth.service';
import { StorageService } from './core/services/storage.service';
import { ToastService } from './shared/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterModule,
    ToastModule,
    OnlineStatusModule
  ],
  providers: [
    MessageService,
    ToastService
  ],
  template: `
    <router-outlet></router-outlet>
    <p-toast position="top-right"></p-toast>
  `
})
export class AppComponent implements OnInit {
  title = 'foto-dej-cms-ng14';

  constructor(
    private translateService: TranslateService,
    private storageService: StorageService,
    private authService: AuthService,
    private toastService: ToastService,
    private onlineStatusService: OnlineStatusService,
    private primengConfig: PrimeNGConfig
  ) {
    this.initTranslation();
  }

  ngOnInit(): void {
    const boUser = this.storageService.getItem('boUser');
    const boToken = this.storageService.getItem('boToken');
    const user = this.storageService.getItem('user');
    const token = this.storageService.getItem('token');

    if(boUser && boToken) {
      this.authService.setBoUser(JSON.parse(boUser));
      this.authService.setBoAuthToken(boToken);
    }

    if(user && token) {
      this.authService.setUser(JSON.parse(user));
      this.authService.setAuthToken(token);
    }

    this.onlineStatusService.status.subscribe({
      next: (res: any) => {
        if (res === 0) {
          this.toastService.addError('errors.offline');
        }
        if (res === 1) {
          this.toastService.addSuccess('success.online');
        }
      }
    });
  }

  initTranslation(): void{
    const defaultLang = 'mk';

    this.translateService.addLangs(['mk','en']);
    this.translateService.setDefaultLang(defaultLang);

    this.storageService.setItem('lang', defaultLang);

    this.translateService.get('primeng').subscribe({
      next: res => {
        this.primengConfig.setTranslation(res);
      },
      error: ko => {
        console.log('Errore translate service get method', ko);
      }
    });
  }
}
