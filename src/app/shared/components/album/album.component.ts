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
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { PermitDirective } from 'src/app/core/directives/permit.directive';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SingleImageComponent,
    FormsModule,
    InputTextModule,
    ConfirmDialogModule,
    TooltipModule,
    TabViewModule,
    PermitDirective,
    OverlayPanelModule
  ],
  templateUrl: './album.component.html'
})
export class AlbumComponent implements OnInit {

  @Input() images: Image[] | undefined = [];
  @Input() selectedImages: Image[] = [];
  @Input() isAdmin: boolean = true;
  @Input() isSelect: boolean = false;
  @Input() userId: string = '';
  @Input() albumId: string = '';

  imageSearch: string = '';
  tabsIndex: number = 0;
  showSelected: boolean = false;

  constructor(
    private albumsStore: AlbumsStore,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private imageOverviewState: ImageOverviewService
  ) { }

  ngOnInit(): void {
    console.log('images on onit', this.images);
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
        const selectedStrArr = [];
        for (const img of this.selectedImages) {
          selectedStrArr.push(img.name);
        }
        this.albumsStore.deleteMultipleImages(selectedStrArr);
      }
    });
  }

  enableSelected(): void {
    this.confirmationService.confirm({
      key: 'enableImages',
      message: this.translate.instant('messages.enableSelectedImages'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        const selectedStrArr = [];
        for (const img of this.selectedImages) {
          selectedStrArr.push(img.name);
        }
        this.albumsStore.enableMultipleImages(selectedStrArr);
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
        const selectedStrArr = [];
        for (const img of this.selectedImages) {
          selectedStrArr.push(img.name);
        }
        this.albumsStore.disableMultipleImages(selectedStrArr);
      }
    });
  }

  filter(): void {
    const searchObj = {
      searchValue: this.imageSearch,
      showSelected: this.showSelected
    };

    this.albumsStore.getAlbumImages(this.albumId, this.imageSearch);
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

  onImageSelect(selectedImages: Image[]): void {
    this.selectedImages = selectedImages;
    this.albumsStore.patchSelectedImages(this.selectedImages);
  }

  deselectAllImages(): void {
    this.selectedImages = [];
    this.albumsStore.patchSelectedImages(this.selectedImages);
    this.albumsStore.selectImages();
  }

  selectAllImages(): void {
    if (this.albumsStore.state.images) {
      this.selectedImages = this.albumsStore.state.images.images;
      this.albumsStore.patchSelectedImages(this.selectedImages);
      this.albumsStore.selectImages();
    }
  }

  onTabChange(): void {
    if (this.tabsIndex === 1) {
      this.albumsStore.getSelectedAlbumImages(this.albumsStore.state.previewAlbum?.id);
      this.showSelected = true;
    } else {
      this.showSelected = false;
    }
  }

  saveSelected(): void {
    this.albumsStore.selectImages();
  }

  clearFilter(): void {
    this.imageSearch = '';
    this.filter();
  }
}
