import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { StorageService } from './core/services/storage.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterModule
  ],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  title = 'foto-dej-cms-ng14';

  constructor(
    private translateService: TranslateService,
    private storageService: StorageService,
    private authService: AuthService

  ) {
    this.initTranslation();
  }

  ngOnInit(): void {
    const boUser = this.storageService.getItem('boUser');
    const boToken = this.storageService.getItem('boToken');
    if(boUser && boToken) {
      this.authService.setBoUser(JSON.parse(boUser));
      this.authService.setBoAuthToken(boToken);
    }
  }

  initTranslation(): void{
    const defaultLang = 'mk';

    this.translateService.addLangs(['mk','en']);
    this.translateService.setDefaultLang(defaultLang);

    this.storageService.setItem('lang', defaultLang)
  }
}
