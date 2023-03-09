import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SliderComponent } from '../../components/slider/slider.component';
import { FrontConfigurationService } from '../../../../../../shared/services/front-configuration.service';
import { environment } from 'src/environments/environment';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { FooterComponent } from '../../../../layout/components/footer/footer.component';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FrontNavbarComponent } from 'src/app/features/front/layout/components/front-navbar/front-navbar.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SliderComponent,
    ContactFormComponent,
    FooterComponent,
    FrontNavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('slider') slider!: HTMLElement;

  videoUrl: string = `${ environment.apiUrl }/videos/`;

  configuration: Configuration = {} as Configuration;
  selectedLang: string | null = 'mk';

  @ViewChild('collaboration') collaboration!: HTMLElement;
  // @ViewChild(HTMLElement) slider!: HTMLElement;

  constructor(
    private service: FrontConfigurationService,
    public frontConfigurationState: FrontConfigurationState,
    private storageService: StorageService,
    private translateService: TranslateService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.service.getConfiguration().subscribe({
      next: res => {
        this.configuration = res;
        this.frontConfigurationState.setConfiguration(res);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  changeLang(): void {
    let lang: string = '';
    if(this.selectedLang === 'mk'){
      lang = 'en'  
    } else {
      lang = 'mk';
    }

    this.translateService.use(lang).subscribe();

    this.storageService.setItem('lang', lang);
    this.selectedLang = this.storageService.getItem('lang');
  }

  goToElement(el: HTMLElement, offset: number): void {
    console.log('EL', el);
    let element = el;

    if(typeof(el) !== 'string'){
      element = el;
    } else if(el === 'collaboration') {
      console.log('COLLAB', Object.entries(this.collaboration)[0][1]);

      element = Object.entries(this.collaboration)[0][1];
    } else if (el === 'slider') {
      console.log('SLIDER', this.slider.innerHTML);

      element = Object.entries(this.slider)[0][1];
    }

    // console.log('ELEMENT', element);
    
    
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth'});
  }
}
