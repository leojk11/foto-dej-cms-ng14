import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { finalize, forkJoin, ignoreElements, merge, mergeMap, Observable, of, Subject, tap } from 'rxjs';
import { AlbumsService } from '../../services/albums.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ToastService } from 'src/app/shared/services/toast.service';

interface SelectedImage {
  id: number;
  file: File;
  preview: string;
}

@Component({
    selector: 'app-album-upload',
    imports: [
    TranslatePipe,
    ProgressBarModule,
    DialogModule,
    ButtonModule
],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './album-upload.component.html'
})
export class AlbumUploadComponent implements OnInit, OnDestroy {

  albumId: string = '';

  selected: SelectedImage[] = [];

  uploading: boolean = false;
  dragOver: boolean = false;
  progressValue: number = 0;

  displayCompletedDialog: boolean = false;

  private nextId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumsService: AlbumsService,
    private adminLayoutService: AdminLayoutService,
    private toastService: ToastService,
    public location: Location
  ) {
    this.route.params.subscribe({
      next: params => {
        if (params['id']) {
          this.albumId = params['id'];
        }
      }
    });
  }

  ngOnInit(): void {
    this.adminLayoutService.setTitle('common.albums', 'albums.uploadImages');
  }

  ngOnDestroy(): void {
    this.selected.forEach(item => URL.revokeObjectURL(item.preview));
  }

  get totalSize(): number {
    return this.selected.reduce((sum, item) => sum + item.file.size, 0);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
      return `${ Math.max(Math.round(bytes / 1024), 1) } KB`;
    }

    return `${ (bytes / (1024 * 1024)).toFixed(1) } MB`;
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = !this.uploading;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;

    if (!this.uploading) {
      this.addFiles(Array.from(event.dataTransfer?.files ?? []));
    }
  }

  private addFiles(files: File[]): void {
    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      const isDuplicate = this.selected.some(item => item.file.name === file.name && item.file.size === file.size);

      if (isImage && !isDuplicate) {
        this.selected.push({ id: this.nextId++, file, preview: URL.createObjectURL(file) });
      }
    }
  }

  removeFile(item: SelectedImage): void {
    URL.revokeObjectURL(item.preview);
    this.selected = this.selected.filter(image => image.id !== item.id);
  }

  clearAll(): void {
    this.selected.forEach(item => URL.revokeObjectURL(item.preview));
    this.selected = [];
  }

  handleUpload(): void {
    if (!this.selected.length || this.uploading) {
      return;
    }

    this.uploading = true;
    this.progressValue = 0;

    const toUpload: Observable<any>[] = this.selected.map(item =>
      this.albumsService.uploadImages(item.file, this.albumId)
    );

    this.forkJoinWithProgress(toUpload).pipe(
      mergeMap(([finalResult, progress]) => merge(
        progress.pipe(
          tap((value: number) => this.progressValue = value),
          ignoreElements()
        ), finalResult
      ))
    ).subscribe({
      next: () => {
        this.uploading = false;
        this.clearAll();
        this.displayCompletedDialog = true;
      },
      error: error => {
        this.uploading = false;
        this.toastService.addError(error?.error?.message ?? error?.message);
      }
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

  goToPreview(): void {
    this.router.navigate(['/bo/albums/' + this.albumId]).then();
  }

}
