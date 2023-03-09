import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { finalize, forkJoin, ignoreElements, merge, mergeMap, Observable, of, Subject, tap } from 'rxjs';
import { AlbumsService } from '../../services/albums.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';

@Component({
  selector: 'app-album-upload',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FileUploadModule,
    ProgressBarModule,
    DialogModule
  ],
  templateUrl: './album-upload.component.html',
  styleUrls: ['./album-upload.component.scss']
})
export class AlbumUploadComponent implements OnInit {

  albumId: string = '';

  uploadedFiles: File[] = [];
  filesToUpload: File[] = [];

  filesToSave: string[] = [];

  uploadDisabled: boolean = false;
  progressValue: number = 0;

  displayCompletedDialog: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumsService: AlbumsService,
    private adminLayoutService: AdminLayoutService,
    public location: Location
  ) { 
    this.route.params.subscribe({
      next: params => {
        console.log('params', params);
        if (params['id']) {
          this.albumId = params['id'];
        }
      }
    });
  }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.albums', 'albums.uploadImages');
  }

  handleUpload(event: any): void {
    this.uploadDisabled = true;

    const toUpload: Observable<any>[] = [];
    for (const file of this.filesToUpload) {
      toUpload.push(this.albumsService.uploadImages(file, this.albumId));
    }

    this.forkJoinWithProgress(toUpload).pipe(
      mergeMap(([finalResult, progress]) => merge(
        progress.pipe(
          tap((value: number) => { this.progressValue = value; }),
          ignoreElements()
        ), finalResult
      ))
    ).subscribe(values => this.displayCompletedDialog = true)
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

  onSelect(event: any): void {
    this.filesToUpload = event.currentFiles;
  }

  onRemove(event: any): void {
    const index = this.filesToUpload.findIndex(inFile => inFile.name === event.file.name);
    this.filesToUpload.splice(index, 1);
  }

  goToPreview(): void {
    this.router.navigate(['/bo/albums/' + this.albumId]).then();
  }

}
