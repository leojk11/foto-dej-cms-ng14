import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { RouterModule } from '@angular/router';
import { FrontConfigurationState, FrontConfigurationStateModel } from '../../../pages/home/services/front-configuration.store';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { FrontConfigurationService } from '../../../pages/home/services/front-configuration.service';

@Component({
  selector: 'app-front-navbar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule
  ],
  templateUrl: './front-navbar.component.html',
  styleUrls: ['./front-navbar.component.scss']
})
export class FrontNavbarComponent implements OnInit {

  selectedLang: string | null = 'mk';
  config: Configuration = {} as Configuration;
  @Input() imageUrl: string = '';

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService,
    private authService: AuthService,
    public frontConfigurationState: FrontConfigurationState,
    private service: FrontConfigurationService
  ) { }

  ngOnInit(): void {
    console.log('LOGO', this.config);
    this.service.getConfiguration().subscribe({
      next: res => {
        this.config = res;
        this.frontConfigurationState.setConfiguration(res);
        console.log('CONFIG RES', res);
        
      },
      error: error => {
        // this.toastService.addError(error.error.message);
      }
      
    });
    console.log('STATE', this.frontConfigurationState.state);
    console.log('LOGO URL', this.frontConfigurationState.state.imageUrl + this.frontConfigurationState.state.configuration.logo);
  }

  changeLang(): void {
    let lang: string = '';
    if(this.selectedLang === 'mk'){
      lang = 'en'  
    } else {
      lang = 'mk';
    }

    this.translateService.use(lang).subscribe({
      next: ok => {
        console.log('OK TRANSLATION', ok);
      },
      error: err => {
        console.log('ERROR TRANSLATE SERVICE USE METHOD', err);
      }
    });

    this.storageService.setItem('lang', lang);
    this.selectedLang = this.storageService.getItem('lang');
    
  }

  logout(): void {
    this.authService.userLogout();
  }

}
