import { RevealDirective } from 'src/app/shared/directives/reveal.directive';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Image } from 'src/app/features/bo/pages/albums/models/image.model';
import { SingleImageComponent } from 'src/app/features/bo/pages/albums/components/single-image/single-image.component';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AlbumsStore } from 'src/app/features/bo/pages/albums/services/albums.store';
import { ImageOverviewService } from '../../services/image-overview.service';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TabsModule } from 'primeng/tabs';
import { PermitDirective } from 'src/app/core/directives/permit.directive';
import { PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { ALBUM_SHOW_IMAGES_AMOUNT } from 'src/app/core/data/staticData';

@Component({
    selector: 'app-album',
    imports: [
        RevealDirective,
        CommonModule,
        TranslatePipe,
        SingleImageComponent,
        FormsModule,
        InputTextModule,
        ConfirmDialogModule,
        TooltipModule,
        TabsModule,
        PermitDirective,
        PopoverModule,
        TableModule
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './album.component.html'
})
export class AlbumComponent implements OnInit {

  @Input() images: Image[] | undefined = [];
  @Input() selectedImages: Image[] = [];
  @Input() selectedAdminImages: Image[] = [];
  @Input() isAdmin: boolean = true;
  @Input() isSelect: boolean = false;
  @Input() userId: string = '';
  @Input() albumId: string = '';

  imageSearch: string = '';
  tabsIndex: number = 0;
  showSelected: boolean = false;

  defaultImagesAmoutToShow: number = ALBUM_SHOW_IMAGES_AMOUNT;
  imagesAmountToShow: number = ALBUM_SHOW_IMAGES_AMOUNT;
  imagesToDisplay: Image[] | undefined = [];
  leftImagesToDisplay: Image[] | undefined = [];

  constructor(
    private albumsStore: AlbumsStore,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private imageOverviewState: ImageOverviewService
  ) { }

  ngOnInit(): void {
    this.imagesToDisplay = this.images?.slice(0, this.imagesAmountToShow);
    this.leftImagesToDisplay = this.images?.slice(this.imagesAmountToShow, this.images.length - 1);
  }

  seeMoreImages(): void {
    this.imagesAmountToShow = this.imagesAmountToShow + this.defaultImagesAmoutToShow;
    this.imagesToDisplay = this.images?.slice(0, this.imagesAmountToShow);
    this.leftImagesToDisplay = this.images?.slice(this.imagesAmountToShow, this.images.length - 1);
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
        for (const img of this.selectedAdminImages) {
          selectedStrArr.push(img.name);
        }
        this.albumsStore.deleteMultipleImages(selectedStrArr);

        this.imagesToDisplay = this.images?.slice(0, this.imagesAmountToShow);
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
        for (const img of this.selectedAdminImages) {
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
        for (const img of this.selectedAdminImages) {
          selectedStrArr.push(img.name);
        }
        this.albumsStore.disableMultipleImages(selectedStrArr);
      }
    });
  }

  filter(): void {
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
    
    this.imageOverviewState.toggleOverview(this.albumId);
    this.imageOverviewState.setImages(event, imagesArr);
  }

  onImageSelect(selectedImages: Image[]): void {
    if (this.isAdmin) {
      this.selectedAdminImages = selectedImages;
      this.albumsStore.patchSelectedAdminImages(this.selectedImages);
    } else {
      this.selectedImages = selectedImages;
      this.albumsStore.patchSelectedImages(this.selectedImages);
    }
  }

  deselectAllImages(): void {
    if (this.isAdmin) {
      this.selectedAdminImages = [];
      this.albumsStore.patchSelectedAdminImages(this.selectedAdminImages);
    } else {
      this.selectedImages = [];
      this.albumsStore.patchSelectedImages(this.selectedImages);

      this.albumsStore.selectImages();
    }
  }

  selectAllImages(): void {
    if (this.albumsStore.snapshot.images) {
      if (this.isAdmin) {
        this.selectedAdminImages = this.albumsStore.snapshot.images.images;
        this.albumsStore.patchSelectedAdminImages(this.selectedAdminImages);
      } else {
        this.selectedImages = this.albumsStore.snapshot.images.images;
        this.albumsStore.patchSelectedImages(this.selectedImages);

        this.albumsStore.selectImages();
      }
    }
  }

  onTabChange(value: string | number | undefined): void {
    this.tabsIndex = Number(value);

    if (this.tabsIndex === 1) {
      this.albumsStore.getSelectedAlbumImages(this.albumsStore.snapshot.previewAlbum?.id);
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
