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
import { NgxSpinnerService } from 'ngx-spinner';

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

  mainTitle: string = '';
  secondTitle: string = '';

  @ViewChild('collaboration') collaboration!: HTMLElement;

  constructor(
    private service: FrontConfigurationService,
    public frontConfigurationState: FrontConfigurationState,
    private translateService: TranslateService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show().then();
    this.translateService.onLangChange.subscribe({
      next: (res:any) => {
        this.selectedLang = res.lang;
        this.getTitles();
      }
    });

    this.service.getConfiguration().subscribe({
      next: res => {
        this.configuration = res;
        this.frontConfigurationState.setConfiguration(res);
        this.getTitles();
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  getTitles(): void {
    if(this.selectedLang === 'mk') {
      this.mainTitle = this.configuration.main_title;
      this.secondTitle = this.configuration.second_title
    } else {
      this.mainTitle = this.configuration.main_title_tr;
      this.secondTitle = this.configuration.second_title_tr;
    }
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

    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth'});
  }
}
