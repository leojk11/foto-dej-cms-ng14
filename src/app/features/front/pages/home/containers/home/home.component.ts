import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SliderComponent } from '../../components/slider/slider.component';
import { FrontConfigurationService } from '../../../../../../shared/services/front-configuration.service';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { FooterComponent } from '../../../../layout/components/footer/footer.component';
import { Configuration } from 'src/app/features/bo/pages/configurations/models/configuration.model';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FrontNavbarComponent } from 'src/app/features/front/layout/components/front-navbar/front-navbar.component';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { StartLoaderComponent } from 'src/app/shared/components/start-loader/start-loader.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { RevealDirective } from 'src/app/shared/directives/reveal.directive';
import { ParallaxDirective } from 'src/app/shared/directives/parallax.directive';

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        TranslatePipe,
        RouterModule,
        SliderComponent,
        ContactFormComponent,
        FooterComponent,
        FrontNavbarComponent,
        YouTubePlayerModule,
        SpinnerComponent,
        StartLoaderComponent,
        RevealDirective,
        ParallaxDirective
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('enterAnimation', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                style({ transform: 'translateX(0)', opacity: 1 }),
                animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class HomeComponent implements OnInit {

  @ViewChild('slider') slider!: HTMLElement;
  @ViewChild('collaboration') collaboration!: HTMLElement;

  showStartLoader: boolean = true;

  promoImagesForSlider: string[] = [];

  videoWidth: number = 960;
  videoHeight: number = 540;
  showVideo: boolean = false;
  videoIds: string[] = [];

  configuration: Configuration = {} as Configuration;
  selectedLang: string | null = 'mk';

  mainTitle: string = '';
  secondTitle: string = '';

  isMobile$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 878px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  mobile: boolean = false;

  mainImageLoaded: boolean = false;
  errorOnLoading: boolean = false;

  constructor(
    private service: FrontConfigurationService,
    public frontConfigurationState: FrontConfigurationState,
    private translateService: TranslateService,
    private toastService: ToastService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.service.setVisit().subscribe();
    document.body.style.overflowY = 'hidden';

    this.translateService.onLangChange.subscribe({
      next: (res:any) => {
        this.selectedLang = res.lang;
        this.getTitles();
      }
    });

    this.service.getConfiguration().subscribe({
      next: res => {
        const promoImagesCopy = JSON.parse(JSON.stringify(res.promo_images));
        this.promoImagesForSlider = promoImagesCopy.splice(0, 6);
        
        for (const video of res.promo_videos) {
          const splittedPromoVideUrl = video.split('=');
          const videoId = splittedPromoVideUrl[1].split('&');
          this.videoIds.push(videoId[0]);
        }
        
        this.showVideo = true;
        
        this.configuration = res;
        this.frontConfigurationState.setConfiguration(res);
        this.getTitles();

        this.showStartLoader = false;
        document.body.style.overflowY = 'auto';
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.errorOnLoading = true;
      }
    });

    this.isMobile$.subscribe({
      next: (res: any) => {
        this.mobile = res;

        if (res) {
          // keep the 16:9 ratio and leave room for the page padding
          this.videoWidth = Math.min(window.innerWidth - 40, 560);
          this.videoHeight = Math.round(this.videoWidth * 9 / 16);
        } else {
          this.videoWidth = 960;
          this.videoHeight = 540;
        }
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
    let element = el;

    if(typeof(el) !== 'string'){
      element = el;
    } else if(el === 'collaboration') {
      element = Object.entries(this.collaboration)[0][1];
    } else if (el === 'slider') {
      element = Object.entries(this.slider)[0][1];
    }

    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth'});
  }

  onMainImageLoad(): void {
    this.mainImageLoaded = true;
  }
}
