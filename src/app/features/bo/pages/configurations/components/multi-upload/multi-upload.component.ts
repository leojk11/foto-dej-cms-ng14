import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Observable, Subject, finalize, forkJoin, ignoreElements, merge, mergeMap, of, tap } from 'rxjs';
import { ConfigurationService } from '../../services/configuration.service';
import { ConfigurationStore } from '../../services/configuration.store';
import { ImageOverviewService, ImageOverviewState } from 'src/app/shared/services/image-overview.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-multi-upload',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ProgressBarModule
  ],
  templateUrl: './multi-upload.component.html',
  styleUrls: ['./multi-upload.component.scss']
})
export class MultiUploadComponent implements OnInit {

  @Input() label: string = '';
  @Input() id: string = '';

  @Input() imagesUrl: string = '';
  @Input() preselected: string = '';

  selectedFiles: File[] = [];
  selectedFilesPreview: string[] = [];

  uploadInPorgress: boolean = false;
  uploadProgressValue: number = 0;

  constructor(
    private toastService: ToastService,
    private configurationService: ConfigurationService,
    private configurationStore: ConfigurationStore,
    private imageOverviewState: ImageOverviewService
  ) { }

  ngOnInit(): void {
  }

  toggleOverview(event: any, images: any): void {
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImages(event.target.src, images);
  }

  selectFiles(event: any): void {
    if (event.target.files.length > 6) {
      this.toastService.addError('errors.maxImages');
    } else {
      const files = [];
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

  uploadFiles(): void {
    this.uploadInPorgress = true;

    const imagesToSave: string[] = [];
    const toUpload: Observable<any>[] = [];
    for (const file of this.selectedFiles) {
      imagesToSave.push(file.name);
      toUpload.push(this.configurationService.uploadImage(file));
    };

    this.forkJoinWithProgress(toUpload).pipe(
      mergeMap(([finalResult, progress]) => merge(
        progress.pipe(
          tap((value: number) => { this.uploadProgressValue = value; }),
          ignoreElements()
        ), finalResult
      ))
    ).subscribe(() => {
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


}
