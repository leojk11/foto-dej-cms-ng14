import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ConfigurationService } from '../../services/configuration.service';
import { ConfigurationStore } from '../../services/configuration.store';

// A single image: pick a file and it is uploaded and saved straight away.
@Component({
    selector: 'app-upload',
    imports: [
        TranslatePipe,
        ProgressBarModule
    ],
    templateUrl: './upload.component.html',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class UploadComponent {

  @Input() darkBg: boolean = false;
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() imagesUrl: string = '';
  @Input() preselected: string = '';

  selectedFilePreview: string = '';
  uploadInProgress: boolean = false;
  uploadProgressValue: number = 0;

  constructor(
    private configurationService: ConfigurationService,
    private configurationStore: ConfigurationStore,
    private toastService: ToastService
  ) { }

  selectFile(event: any): void {
    const file: File | undefined = event.target.files[0];
    if (!file) {
      return;
    }

    // show the new image right away while it uploads
    const reader = new FileReader();
    reader.onload = () => this.selectedFilePreview = reader.result as string;
    reader.readAsDataURL(file);

    this.uploadFile(file);
    event.target.value = '';
  }

  private uploadFile(file: File): void {
    this.uploadInProgress = true;

    this.configurationService.uploadImage(file, 'configuration_image').subscribe({
      next: res => {
        if (res.type === HttpEventType.UploadProgress) {
          this.uploadProgressValue = Math.round((100 * res.loaded) / res.total);
        } else if (res instanceof HttpResponse) {
          this.configurationService.updateConfiguration({ [this.id]: file.name }).subscribe({
            next: updateRes => {
              this.configurationStore.patchConfiguration(updateRes.configuration);
              this.toastService.addSuccess(updateRes.message);
              this.finishUpload();
            },
            error: error => this.failUpload(error)
          });
        }
      },
      error: error => this.failUpload(error)
    });
  }

  private finishUpload(): void {
    this.selectedFilePreview = '';
    this.uploadInProgress = false;
    this.uploadProgressValue = 0;
  }

  private failUpload(error: any): void {
    this.toastService.addError(error.error.message);
    this.selectedFilePreview = '';
    this.uploadInProgress = false;
    this.uploadProgressValue = 0;
  }
}
