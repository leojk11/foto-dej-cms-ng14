import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SliderComponent } from '../../components/slider/slider.component';
import { FrontConfigurationService } from '../../services/front-configuration.service';
import { environment } from 'src/environments/environment';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { HomeFooterComponent } from '../../components/home-footer/home-footer.component';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { FrontConfigurationState } from '../../services/front-configuration.store';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FrontNavbarComponent } from 'src/app/features/front/layout/components/front-navbar/front-navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SliderComponent,
    ContactFormComponent,
    HomeFooterComponent,
    FrontNavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('slider') slider!: ElementRef;

  videoUrl: string = `${ environment.apiUrl }/videos/`;

  configuration: Configuration = {} as Configuration;
  selectedLang: string | null = 'mk';

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

    this.translateService.use(lang).subscribe({
      next: ok => {
      },
      error: err => {
      }
    });

    this.storageService.setItem('lang', lang);
    this.selectedLang = this.storageService.getItem('lang');
  }

  goToElement(el: HTMLElement, offset: number): void {
    const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth'});
  }
}
