import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Image } from 'src/app/features/bo/pages/albums/models/image.model';
import { SingleImageComponent } from 'src/app/features/bo/pages/albums/components/single-image/single-image.component';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AlbumsStore } from 'src/app/features/bo/pages/albums/services/albums.store';
import { ImageOverviewService } from '../../services/image-overview.service';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SingleImageComponent,
    FormsModule,
    InputTextModule,
    ConfirmDialogModule
  ],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  @Input() images: Image[] | undefined = [];
  @Input() isAdmin: boolean = true;
  @Input() isSelect: boolean = false;
  @Output() onImageSearch = new EventEmitter();

  imageSearch: string = '';
  selectedImages: string[] = [];

  constructor(
    private albumsStore: AlbumsStore,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private imageOverviewState: ImageOverviewService
  ) { }

  ngOnInit(): void {
  }

  deleteSelected(): void {
    this.confirmationService.confirm({
      key: 'deleteImage',
      message: this.translate.instant('messages.deleteSelectedImages'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        this.albumsStore.deleteMultipleImages(this.selectedImages);
      }
    });
  }

  disableSelected(): void {
    this.confirmationService.confirm({
      key: 'disableImages',
      message: this.translate.instant('messages.disableSelectedImages'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        this.albumsStore.disableMultipleImages(this.selectedImages);
      }
    });
  }

  filter(): void {
    this.onImageSearch.emit( this.imageSearch);
  }

  deleteImage(event: string, index: number): void {
    this.confirmationService.confirm({
      key: 'deleteImage',
      message: this.translate.instant('messages.deleteImage'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        this.albumsStore.deleteImage(event, index);
      }
    });
  }

  onToggleOverview(event: any, images: any): void {
    const imagesArr = [];
    for (const image of images) {
      imagesArr.push(image.name);
    }
    
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImages(event, imagesArr);
  }

  onImageSelect(selectedImages: string[]): void {
    this.selectedImages = selectedImages;
  }
}
