import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';
import { FooterComponent } from 'src/app/features/front/layout/components/footer/footer.component';
import { FrontNavbarComponent } from 'src/app/features/front/layout/components/front-navbar/front-navbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationService } from 'src/app/features/bo/pages/configurations/services/configuration.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';
import { ImageOverviewService } from 'src/app/shared/services/image-overview.service';
import { ImageOverviewComponent } from 'src/app/shared/components/image-overview/image-overview.component';
import { GALLERY_PAGE_IMAGES_AMOUNT } from 'src/app/core/data/staticData';
import { FrontSingleImageComponent } from 'src/app/shared/components/front-single-image/front-single-image.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    FrontNavbarComponent,
    TranslateModule,
    ImageOverviewComponent,
    FrontSingleImageComponent
  ],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  imagesUrl: string = `${ environment.apiUrl }/images/`;

  defaultImagesAmoutToShow: number = GALLERY_PAGE_IMAGES_AMOUNT;
  imagesAmountToShow: number = GALLERY_PAGE_IMAGES_AMOUNT;
  imagesToDisplay: string[] | undefined = [];
  leftImagesToDisplay: string[] | undefined = [];

  constructor(
    public frontConfigurationState: FrontConfigurationState,
    private configurationService: ConfigurationService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private imageOverviewState: ImageOverviewService
  ) { }

  ngOnInit(): void {
    if (!this.frontConfigurationState.state.configuration.id) {
      this.spinner.show().then();

      this.configurationService.getConfiguration().subscribe({
        next: configuration => {
          this.frontConfigurationState.setConfiguration(configuration);
          this.spinner.hide().then();

          this.imagesToDisplay = configuration.promo_images.slice(0, this.imagesAmountToShow);
          this.leftImagesToDisplay = configuration.promo_images.slice(this.imagesAmountToShow, configuration.promo_images.length);
        },
        error: error => {
          this.toastService.addError(error.error.message);
          this.spinner.hide().then();
        }
      });
    } else {
      this.imagesToDisplay = this.frontConfigurationState.state.configuration.promo_images.slice(0, this.imagesAmountToShow);
      this.leftImagesToDisplay = this.frontConfigurationState.state.configuration.promo_images.slice(this.imagesAmountToShow, 
        this.frontConfigurationState.state.configuration.promo_images.length);
    }
  }

  seeMoreImages(): void {
    this.imagesAmountToShow = this.imagesAmountToShow + this.defaultImagesAmoutToShow;
    this.imagesToDisplay = this.frontConfigurationState.state.configuration.promo_images.slice(0, this.imagesAmountToShow);
    this.leftImagesToDisplay = this.frontConfigurationState.state.configuration.promo_images.slice(this.imagesAmountToShow, 
      this.frontConfigurationState.state.configuration.promo_images.length);
  }

  goToElement(el: HTMLElement, offset: number): void {
    let element = el;

    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth'});
  }

  toggleOverview(event: any, images: any): void {
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImages(event.target.src, images);
  }
}
