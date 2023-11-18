import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Observable, Subject, finalize, forkJoin, ignoreElements, merge, mergeMap, of, tap } from 'rxjs';
import { ConfigurationService } from '../../services/configuration.service';
import { ConfigurationStore } from '../../services/configuration.store';
import { ImageOverviewService } from 'src/app/shared/services/image-overview.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-multi-upload',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ProgressBarModule,
    ConfirmDialogModule
  ],
  templateUrl: './multi-upload.component.html',
  styleUrls: ['./multi-upload.component.scss']
})
export class MultiUploadComponent implements OnInit {

  @Input() label: string = '';
  @Input() id: string = '';

  @Input() imagesUrl: string = '';
  @Input() preselected: string[] = [];

  @ViewChild('fileUploader') fileUploader: ElementRef = {} as ElementRef;

  selectedFiles: File[] = [];
  selectedFilesPreview: string[] = [];

  uploadInPorgress: boolean = false;
  uploadProgressValue: number = 0;

  constructor(
    private toastService: ToastService,
    private configurationService: ConfigurationService,
    private configurationStore: ConfigurationStore,
    private imageOverviewState: ImageOverviewService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void { 
    console.log('preselected', this.preselected);
    
  }

  toggleOverview(event: any, images: any): void {
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImages(event.target.src, images);
  }

  selectFiles(event: any): void {
    let files: any = [];

    if (this.preselected) {
      for (const preselectedImage of this.preselected) {
        this.configurationService.getImageBase64(preselectedImage).subscribe({
          next: res => {
            console.log('single image res');
            const imageBlob = this.dataURItoBlob(res.buffer);
            const imageFile = new File([imageBlob], preselectedImage, { type: 'image/png' });
            files.push(imageFile);

            const reader = new FileReader();
            reader.onload = () => {
              this.selectedFilesPreview.push(reader.result as string);
            };
            reader.readAsDataURL(imageFile);
          }
        });
      }

      for (const file of event.target.files) {
        files.push(file);
  
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedFilesPreview.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
  
      this.selectedFiles = files;

    } else {
      for (const file of event.target.files) {
        files.push(file);
  
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedFilesPreview.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
  
      this.selectedFiles = files;
    }
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
  }

  uploadFiles(): void {
    this.uploadInPorgress = true;

    let imagesToSave: string[] = [];
    const toUpload: Observable<any>[] = [];
    for (const file of this.selectedFiles) {
      imagesToSave.push(file.name);
      toUpload.push(this.configurationService.uploadImage(file, 'promo_images'));
    };

    this.forkJoinWithProgress(toUpload).pipe(
      mergeMap(([finalResult, progress]) => merge(
        progress.pipe(
          tap((value: number) => { this.uploadProgressValue = value; }),
          ignoreElements()
        ), finalResult
      ))
    ).subscribe(() => {
      imagesToSave = [ ...new Set(imagesToSave) ];
      this.configurationService.updateConfiguration({
        [this.id]: JSON.stringify(imagesToSave)
      }).subscribe({
        next: updateConfRes => {
          this.selectedFilesPreview = [];
          this.configurationStore.patchConfiguration(updateConfRes.configuration);
          this.toastService.addSuccess(updateConfRes.message);

          this.uploadInPorgress = false;
        },
        error: error => {
          this.toastService.addError(error.error.message);
          this.uploadInPorgress = false;
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

  clearPromoImages(): void {
    this.confirmationService.confirm({
      key: 'clearPromoImages',
      message: this.translate.instant('messages.clearPromoImages'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        if (!this.preselected) {
          this.selectedFiles = [];
          this.selectedFilesPreview = [];

          if (this.fileUploader) {
            this.fileUploader.nativeElement.value = null;
          }
        } else {
          this.configurationService.clearPromoImages().subscribe({
            next: res => {
              this.preselected = [];
              this.configurationStore.patchConfiguration(res.configuration);
              this.toastService.addSuccess(res.message);
            },
            error: error => {
              this.toastService.addError(error.error.message);
            }
          });
        }
      }
    });
  }
}
