import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ConfigurationStore } from '../../services/configuration.store';
import { ConfigurationService } from '../../services/configuration.service';
import { ImageOverviewService } from 'src/app/shared/services/image-overview.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TranslateModule
  ],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  loaded: boolean = true;

  imagesUrl: string = `${ environment.apiUrl }/images/`;
  videoUrl: string = `${ environment.apiUrl }/videos/`

  selectedMainImage: File | null = null;
  selectedMainImagePreview: string = '';
  mainImageUploadProgressInfo: { value: number, fileName: string } | null = null;
  mainImageUploadInProgress: boolean = false;

  selectedPromoImages: File[] = [];
  selectedPromoImagesPreview: string[] = [];
  promoImagesUploadProgressInfos: { value: number, fileName: string }[] = [];
  promoImagesUploadInProgress: boolean = false;
  promoImagesToUpload: number = 0;
  promoImagesUploaded: number = 0;

  selectedVideo: File | null = null;
  videoUploadProgressInfo: { value: number, fileName: string } | null = null;
  videoUploadInProgress: boolean = false;

  form: FormGroup = this.fb.group({
    logo: [''],
    main_title: [''],
    second_title: [''],
    contact_form_label: [''],
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
    private imageOverviewState: ImageOverviewService
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
  // image: string, images?: string[]
  toggleOverview(event: any): void {
    console.log(event.target.src);
    
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
        // this.toast.success(res.message);
      },
      error: error => {
        // this.toast.error(error.error.message);
      }
    });
  }

  cancel(): void {
    this.form.patchValue({
      ...this.configurationStore.state.configuration
    });
  }

  uploadMainImage(): void {
    if (this.selectedMainImage) {
      this.mainImageUploadInProgress = true;

      this.mainImageUploadProgressInfo = { value: 0, fileName: this.selectedMainImage.name };
      this.configurationService.uploadImage(this.selectedMainImage).subscribe({
        next: res => {
          if (res.type === HttpEventType.UploadProgress) {
            if (this.mainImageUploadProgressInfo) {
              this.mainImageUploadProgressInfo.value = Math.round(
                (100 * res.loaded) / res.total
              );
            }
          } else if (res instanceof HttpResponse) {
            this.configurationService.updateConfiguration({
              main_image: this.selectedMainImage?.name
            }).subscribe({
              next: updateImageRes => {
                this.configurationStore.updateConfiguration(updateImageRes.configuration);
                // this.toast.success('Main image has been updated.');
              },
              error: error => {
                // this.toast.error(error.error.message);
              }
            });
          }
        },
        error: error => {
          // this.toast.error(error.error.message);
        }
      });
    } else {
      // this.toast.error('You have no image selected!!');
    }
  }

  selectFile(event: any): void {
    this.loaded = false;

    if (event.target.files[0]) {
      this.selectedMainImage = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedMainImagePreview = reader.result as string;
      }
      reader.readAsDataURL(event.target.files[0]);

      this.loaded = true;
    }
  }

  selectMultipleFiles(event: any): void {
    if (event.target.files.length > 6) {
      // this.toast.error('You can select maximum 6 promo photos!');
    } else {
      const files = [];
      for (const file of event.target.files) {
        files.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          this.selectedPromoImagesPreview.push(reader.result as string);
        }
        reader.readAsDataURL(file);
      }

      this.selectedPromoImages = files;
    }
  }

  uploadPromoImages(): void {
    this.promoImagesToUpload = this.selectedPromoImages.length;
    
    if (this.selectedPromoImages.length > 0) {
      this.promoImagesUploadInProgress = true;
      const imagesToSave: any = [];

      for (const image of this.selectedPromoImages) {
        const index = this.selectedPromoImages.findIndex(inImg => inImg.name === image.name);

        this.promoImagesUploadProgressInfos[index] = { value: 0, fileName: image.name };
        this.configurationService.uploadImage(image).subscribe({
          next: res => {
            if (res.type === HttpEventType.UploadProgress) {
              this.promoImagesUploadProgressInfos[index].value = Math.round(
                (100 * res.loaded) / res.total
              );
            } else if (res instanceof HttpResponse) {
              this.promoImagesUploaded++;
              imagesToSave.push(image.name);

              if (this.promoImagesToUpload === this.promoImagesUploaded) {
                this.configurationService.updateConfiguration({
                  promo_images: JSON.stringify(imagesToSave)
                }).subscribe({
                  next: updateConfRes => {
                    this.configurationStore.updateConfiguration(updateConfRes.configuration);
                    // this.toast.success('Configuration promo images have been updated!');
                  },
                  error: error => {
                    // this.toast.error(error.error.message);
                  }
                });
              }
            }
          },
          error: error => {
            // this.toast.error(error.error.message);
          }
        });
      }
    } else {
      // this.toast.error('You need to select at least 1 image!!');
    }
  }

  selectVideo(event: any): void {
    this.selectedVideo = event.target.files[0];
  }

  uploadVideo(): void {
    if (this.selectedVideo) {
      this.videoUploadInProgress = true;

      this.videoUploadProgressInfo = { value: 0, fileName: this.selectedVideo.name };
      this.configurationService.uploadVideo(this.selectedVideo).subscribe({
        next: res => {
          if (res.type === HttpEventType.UploadProgress) {
            if (this.videoUploadProgressInfo) {
              this.videoUploadProgressInfo.value = Math.round(
                (100 * res.loaded) / res.total
              );
            }
          } else if (res instanceof HttpResponse) {
            this.configurationService.updateConfiguration({
              promo_video: this.selectedVideo?.name
            }).subscribe({
              next: updatePromoVideoRes => {
                this.configurationStore.updateConfiguration(updatePromoVideoRes.configuration);
                // this.toast.success('Promo video has been updated.');
              },
              error: error => {
                // this.toast.error(error.error.message);
              }
            });
          }
        },
        error: error => {
          // this.toast.error(error.error.message);
        }
      });
    } else {
      // this.toast.error('You have no video selected!!');
    }
  }

}
