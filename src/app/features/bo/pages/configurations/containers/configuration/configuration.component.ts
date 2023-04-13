import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ConfigurationStore } from '../../services/configuration.store';
import { ConfigurationService } from '../../services/configuration.service';
import { ImageOverviewService } from 'src/app/shared/services/image-overview.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { finalize, forkJoin, ignoreElements, merge, mergeMap, Observable, of, Subject, tap } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegularInputComponent } from '../../components/regular-input/regular-input.component';
import { RegularInputDoubleComponent } from '../../components/regular-input-double/regular-input-double.component';
import { UploadComponent } from '../../components/upload/upload.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    ProgressBarModule,
    RegularInputComponent,
    RegularInputDoubleComponent,
    UploadComponent
  ],
  providers: [
    ConfigurationStore
  ],
  templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {

  loaded: boolean = true;
  logoLoaded: boolean = true;
  whiteLogoLoaded: boolean = true;
  logoIconLoaded: boolean = true;

  imagesUrl: string = `${ environment.apiUrl }/images/`;
  videoUrl: string = `${ environment.apiUrl }/videos/`;

  selectedPromoImages: File[] = [];
  selectedPromoImagesPreview: string[] = [];
  promoImagesUploadInProgress: boolean = false;
  promoImagesToUpload: number = 0;
  promoImagesUploaded: number = 0;
  promoImagesProgressValue: number = 0;

  selectedVideo: File | null = null;
  videoUploadInProgress: boolean = false;
  videoUploadProgressValue: number = 0;

  form: FormGroup = this.fb.group({
    logo: [''],
    main_title: [''],
    main_title_tr: [''],
    second_title: [''],
    second_title_tr: [''],
    phone_number: [''],
    email: [''],
    address: [''],
    facebook_link: [''],
    insta_link: ['']
  });

  constructor(
    private adminLayoutService: AdminLayoutService,
    public configurationStore: ConfigurationStore,
    private configurationService: ConfigurationService,
    private fb: FormBuilder,
    private imageOverviewState: ImageOverviewService,
    private toastService: ToastService,
    public location: Location,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.settings');

    this.configurationStore.getConfiguration();
    
    this.configurationStore.state$.subscribe({
      next: state => {

        if (!!state.configuration) {
          this.form.patchValue({
            ...state.configuration
          });
        }
      }
    });
  }

  toggleOverview(event: any): void {
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImage(event.target.src);
  }

  toggleOverviewPromo(event: any, images: any): void {
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImages(event.target.src, images);
  }

  handleSubmit(): void {
    this.configurationService.updateConfiguration(this.form.value).subscribe({
      next: res => {
        this.toastService.addSuccess(res.message);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  cancel(): void {
    this.form.patchValue({
      ...this.configurationStore.state.configuration
    });
  }

  selectMultipleFiles(event: any): void {
    if (event.target.files.length > 6) {
      this.toastService.addError('errors.maxImages');
    } else {
      const files = [];
      for (const file of event.target.files) {
        files.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          this.selectedPromoImagesPreview.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      this.selectedPromoImages = files;
    }
  }

  uploadPromoImagesNew(): void {
    this.promoImagesUploadInProgress = true;

    const imagesToSave: string[] = [];
    const toUpload: Observable<any>[] = [];
    for (const file of this.selectedPromoImages) {
      imagesToSave.push(file.name);
      toUpload.push(this.configurationService.uploadImage(file));
    };

    this.forkJoinWithProgress(toUpload).pipe(
      mergeMap(([finalResult, progress]) => merge(
        progress.pipe(
          tap((value: number) => { this.promoImagesProgressValue = value; }),
          ignoreElements()
        ), finalResult
      ))
    ).subscribe(() => {
      this.configurationService.updateConfiguration({
        promo_images: JSON.stringify(imagesToSave)
      }).subscribe({
        next: updateConfRes => {
          this.selectedPromoImagesPreview = [];
          this.configurationStore.patchConfiguration(updateConfRes.configuration);
          this.toastService.addSuccess(updateConfRes.message);

          this.promoImagesUploadInProgress = false;
        },
        error: error => {
          this.toastService.addError(error.error.message);
          this.promoImagesUploadInProgress = false;
        }
      });
    });
  }

  forkJoinWithProgress(toUpload: Observable<any>[]): Observable<any> {
    let counter = 0;
    const percent$ = new Subject();

    const modifiedObservablesList = toUpload.map(
      (item, index) => item.pipe(
        finalize(() => {
          const percentValue = ++counter * 100 / toUpload.length;
          percent$.next(percentValue);
        })
      )
    );

    const finalResult$ = forkJoin(modifiedObservablesList).pipe(
      tap(() => {
        percent$.next(100);
        percent$.complete();
      })
    );

    return of([finalResult$, percent$.asObservable()]);
  }

  selectVideo(event: any): void {
    this.selectedVideo = event.target.files[0];
  }

  uploadVideo(): void {
    if (this.selectedVideo) {
      this.videoUploadInProgress = true;

      this.configurationService.uploadVideo(this.selectedVideo).subscribe({
        next: res => {
          if (res.type === HttpEventType.UploadProgress) {
            this.videoUploadProgressValue =  Math.round((100 * res.loaded) / res.total);
          } else if (res instanceof HttpResponse) {
            this.configurationService.updateConfiguration({
              promo_video: this.selectedVideo?.name
            }).subscribe({
              next: updatePromoVideoRes => {
                this.configurationStore.patchConfiguration(updatePromoVideoRes.configuration);
                this.toastService.addSuccess(updatePromoVideoRes.message);

                this.videoUploadInProgress = false;
              },
              error: error => {
                this.toastService.addError(error.error.message);
                this.videoUploadInProgress = false;
              }
            });
          }
        },
        error: error => {
          this.toastService.addError(error.error.message);
          this.videoUploadInProgress = false;
        }
      });
    } else {
      this.toastService.addError('errors.noVideoSelected');
    }
  }
}
