import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ImageOverviewService } from 'src/app/shared/services/image-overview.service';
import { ConfigurationService } from '../../services/configuration.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ConfigurationStore } from '../../services/configuration.store';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    ProgressBarModule
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Input() darkBg: boolean = false;

  @Input() label: string = '';
  @Input() id: string = '';

  @Input() imagesUrl: string = '';

  @Input() preselected: string = '';

  loaded: boolean = true;

  selectedFile!: File; 
  selectedFilePreview: string = '';
  uploadInProgress: boolean = false;
  uploadProgressValue: number = 0;

  constructor(
    private imageOverviewState: ImageOverviewService,
    private configurationService: ConfigurationService,
    private configurationStore: ConfigurationStore,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
  }

  toggleOverview(event: any): void {
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImage(event.target.src);
  }

  selectFile(event: any): void {
    this.loaded = false;

    if (event.target.files[0]) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFilePreview = reader.result as string;
      }
      reader.readAsDataURL(event.target.files[0]);

      this.loaded = true;
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.uploadInProgress = true;

      this.configurationService.uploadImage(this.selectedFile).subscribe({
        next: res => {
          if (res.type === HttpEventType.UploadProgress) {
            this.uploadProgressValue = Math.round((100 * res.loaded) / res.total);
          } else if (res instanceof HttpResponse) {
            this.configurationService.updateConfiguration({
              [this.id]: this.selectedFile?.name
            }).subscribe({
              next: updateImageRes => {
                this.configurationStore.patchConfiguration(updateImageRes.configuration);
                this.toastService.addSuccess(updateImageRes.message);
                
                this.uploadInProgress = false;
              },
              error: error => {
                this.toastService.addError(error.error.message);
                this.uploadInProgress = false;
              }
            });
          }
        },
        error: error => {
          this.toastService.addError(error.error.message);
          this.uploadInProgress = false;
        }
      });
    } else {
      this.toastService.addError('errors.mustSelectImage');
    }
  }
}
