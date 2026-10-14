import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FrontConfigurationState } from 'src/app/shared/services/front-configuration.store';
import { FooterComponent } from 'src/app/features/front/layout/components/footer/footer.component';
import { FrontNavbarComponent } from 'src/app/features/front/layout/components/front-navbar/front-navbar.component';
import { ConfigurationService } from 'src/app/features/bo/pages/configurations/services/configuration.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';
import { ImageOverviewService } from 'src/app/shared/services/image-overview.service';
import { ImageOverviewComponent } from 'src/app/shared/components/image-overview/image-overview.component';
import { RevealDirective } from 'src/app/shared/directives/reveal.directive';

const PAGE_SIZE = 12;

@Component({
    selector: 'app-gallery',
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        FooterComponent,
        FrontNavbarComponent,
        TranslatePipe,
        ImageOverviewComponent,
        RevealDirective
    ],
    templateUrl: './gallery.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {

  imagesUrl: string = `${ environment.apiUrl }/images/`;

  images: string[] = [];
  visibleImages: string[] = [];
  loading: boolean = true;
  skeletons: number[] = Array.from({ length: 6 }, (_, i) => i);

  private visibleCount: number = PAGE_SIZE;
  private loadedImages = new Set<string>();
  private observer: IntersectionObserver | null = null;

  // the "see all" button doubles as the infinite scroll trigger
  @ViewChild('sentinel')
  set sentinel(ref: ElementRef<HTMLElement> | undefined) {
    this.observer?.disconnect();

    if (ref && typeof IntersectionObserver !== 'undefined') {
      this.observer = this.observer ?? new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          this.loadMore();
          this.cdr.detectChanges();
        }
      }, { rootMargin: '0px 0px 400px 0px' });

      this.observer.observe(ref.nativeElement);
    }
  }

  get hasMore(): boolean {
    return this.visibleImages.length < this.images.length;
  }

  constructor(
    public frontConfigurationState: FrontConfigurationState,
    private configurationService: ConfigurationService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private imageOverviewState: ImageOverviewService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const configuration = this.frontConfigurationState.state.configuration;

    if (configuration.id) {
      this.setImages(configuration.promo_images);
      return;
    }

    this.spinner.show().then();

    this.configurationService.getConfiguration().subscribe({
      next: res => {
        this.frontConfigurationState.setConfiguration(res);
        this.setImages(res.promo_images);
        this.spinner.hide().then();
      },
      error: error => {
        this.loading = false;
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  loadMore(): void {
    this.visibleCount += PAGE_SIZE;
    this.visibleImages = this.images.slice(0, this.visibleCount);
  }

  onImageLoad(image: string): void {
    this.loadedImages.add(image);
  }

  isLoaded(image: string): boolean {
    return this.loadedImages.has(image);
  }

  openImage(image: string): void {
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImages(this.imagesUrl + image, this.images);
  }

  private setImages(images: string[] | undefined): void {
    this.images = images ?? [];
    this.visibleImages = this.images.slice(0, this.visibleCount);
    this.loading = false;
  }
}
