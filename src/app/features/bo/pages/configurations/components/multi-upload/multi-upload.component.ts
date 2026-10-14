import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ImageOverviewService } from 'src/app/shared/services/image-overview.service';
import { CONF_SHOW_IMAGES_AMOUNT } from 'src/app/core/data/staticData';
import { ConfigurationService } from '../../services/configuration.service';
import { ConfigurationStore } from '../../services/configuration.store';

// A gallery of saved images: pick files and they are uploaded and saved straight away.
@Component({
    selector: 'app-multi-upload',
    imports: [
        TranslatePipe,
        ProgressBarModule,
        ConfirmDialogModule
    ],
    templateUrl: './multi-upload.component.html',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class MultiUploadComponent {

  @Input() label: string = '';
  @Input() id: string = '';
  @Input() imagesUrl: string = '';
  @Input() preselected: string[] = [];

  uploadInProgress: boolean = false;
  uploadProgressValue: number = 0;

  private imagesAmountToShow: number = CONF_SHOW_IMAGES_AMOUNT;

  constructor(
    private toastService: ToastService,
    private configurationService: ConfigurationService,
    private configurationStore: ConfigurationStore,
    private imageOverviewState: ImageOverviewService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  get visibleImages(): string[] {
    return (this.preselected ?? []).slice(0, this.imagesAmountToShow);
  }

  get hiddenCount(): number {
    return Math.max((this.preselected?.length ?? 0) - this.imagesAmountToShow, 0);
  }

  toggleOverview(event: any): void {
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImages(event.target.src, this.preselected ?? []);
  }

  seeMoreImages(): void {
    this.imagesAmountToShow += CONF_SHOW_IMAGES_AMOUNT;
  }

  selectFiles(event: any): void {
    const files: File[] = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length > 0) {
      this.uploadFiles(files);
    }
  }

  private uploadFiles(files: File[]): void {
    this.uploadInProgress = true;
    this.uploadProgressValue = 0;

    let done = 0;
    const uploads: Observable<any>[] = files.map(file => {
      const upload$ = this.configurationService.uploadImage(file, this.id);
      return new Observable(subscriber => upload$.subscribe({
        next: value => subscriber.next(value),
        error: error => subscriber.error(error),
        complete: () => {
          this.uploadProgressValue = Math.round(++done * 100 / files.length);
          subscriber.complete();
        }
      }));
    });

    forkJoin(uploads).subscribe({
      next: () => this.saveImages([ ...new Set([ ...(this.preselected ?? []), ...files.map(file => file.name) ]) ]),
      error: error => {
        this.toastService.addError(error.error.message);
        this.uploadInProgress = false;
      }
    });
  }

  private saveImages(images: string[]): void {
    this.configurationService.updateConfiguration({
      [this.id]: JSON.stringify(images)
    }).subscribe({
      next: res => {
        this.configurationStore.patchConfiguration(res.configuration);
        this.toastService.addSuccess(res.message);
        this.uploadInProgress = false;
        this.uploadProgressValue = 0;
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.uploadInProgress = false;
        this.spinner.hide().then();
      }
    });
  }

  clearPromoImages(): void {
    this.confirm('messages.clearPromoImages', () => {
      this.spinner.show().then();
      this.configurationService.clearPromoImages().subscribe({
        next: res => {
          this.configurationStore.patchConfiguration(res.configuration);
          this.toastService.addSuccess(res.message);
          this.spinner.hide().then();
        },
        error: error => {
          this.toastService.addError(error.error.message);
          this.spinner.hide().then();
        }
      });
    });
  }

  deleteSavedImage(index: number): void {
    const image = this.preselected?.[index];
    if (!image) {
      return;
    }

    this.confirm('messages.deleteImage', () => {
      this.spinner.show().then();
      this.configurationService.deleteSingleImage(image.split('.')[0]).subscribe({
        next: () => this.saveImages((this.preselected ?? []).filter((_, i) => i !== index)),
        error: error => {
          this.toastService.addError(error.error.message);
          this.spinner.hide().then();
        }
      });
    });
  }

  private confirm(messageKey: string, accept: () => void): void {
    this.confirmationService.confirm({
      key: 'clearPromoImages',
      message: this.translate.instant(messageKey),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept
    });
  }
}
