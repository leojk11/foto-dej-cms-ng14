import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { Client } from '../../clients/models/client.model';
import { Album } from '../models/album.model';
import { AlbumsService } from './albums.service';
import {GetAlumImagesResponse} from "../models/getAlumImagesResponse.model";
import { AdminLayoutService } from '../../../layout/services/admin-layout.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Image } from '../models/image.model';
import { NgxSpinnerService } from 'ngx-spinner';

export interface AlbumsState {
  list: Album[],
  params: BasicParams,
  total: number;

  images: GetAlumImagesResponse | null;
  selectedImages: Image[];
  selectedAdminImages: Image[];

  loading: boolean;

  previewAlbum: Album | null;

  clients: Client[];
  clientsTotal: number;
  clientsParams: BasicParams;
};

export const initialState: AlbumsState = {
  list: [],
  params: {
    page: 1,
    take: 20 // 20 just to test
  },
  total: 0,

  images: null,
  selectedImages: [],
  selectedAdminImages: [],

  loading: true,

  previewAlbum: null,

  clients: [],
  clientsTotal: 0,
  clientsParams: {
    page: 1,
    take: 10
  }
};

@Injectable({
  providedIn: 'root'
})
export class AlbumsStore extends ComponentStore<AlbumsState> {

  constructor(
    private albumsService: AlbumsService,
    private router: Router,
    private adminLayoutService: AdminLayoutService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) {
    super(initialState);
  }

  get state() {
    return this.get(s => s);
  }

  setLoading(loading: boolean): void {
    this.patchState({ loading });
  }

  resetPreview(): void {
    this.patchState({ previewAlbum: null });
  }

  getAllAlbums(): void {
    this.spinner.show().then();

    this.albumsService.getAllAlbums(this.state.params).subscribe({
      next: res => {
        this.patchState({
          list: res.list,
          total: res.total,

          loading: false
        });
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  getUserAlbums(userId: string): void {
    this.spinner.show().then();

    this.albumsService.getUserAlbums(userId, this.state.params).subscribe({
      next: res => {
        this.patchState({
          list: res.list,
          total: res.total,

          loading: false
        });
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  getSingleAlbum(id: string, image?: string): void {
    this.spinner.show().then();

    this.albumsService.getSingleAlbum(id).subscribe({
      next: singleAlbum => {
        this.albumsService.getAlbumImages(id, image).subscribe({
          next: albumImages => {
            this.albumsService.getSelectedAlbumImages(id).subscribe({
              next: selectedImages => {
                this.adminLayoutService.setTitle('common.albums', `${ singleAlbum.title } (${singleAlbum.date})`);
                
                this.patchState({
                  previewAlbum: singleAlbum,
                  images: albumImages,
                  loading: false
                });
                this.spinner.hide().then();
              },
              error: error => {
                this.toastService.addError(error.error.message);
                this.spinner.hide().then();
              }
            });
          },
          error: error => {
            this.toastService.addError(error.error.message);
            this.spinner.hide().then();
          }
        });
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  getAlbumImages(id: string, image?: string): void {
    this.spinner.show().then();

    this.albumsService.getAlbumImages(id, image).subscribe({
      next: albumImages => {
        this.patchState({ images: albumImages });
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  getSelectedAlbumImages(albumId: string | undefined, image?: string): void {
    this.spinner.show().then();

    this.albumsService.getSelectedAlbumImages(albumId, image).subscribe({
      next: selectedImages => {
        if(selectedImages)
          this.patchState({ selectedImages: selectedImages?.images });
        this.spinner.hide().then();
      },
      error: error => {
        this.spinner.hide().then();
        this.toastService.addError(error.error.message);
      }
    });
  }

  patchPreviewAlbum(album: Album): void {
    this.patchState({ previewAlbum: album });
  }

  patchExistingAlbums(newAlbum: Album): void {
    const list = this.state.list;
    list.push(newAlbum);

    this.patchState({
      list,
      total: this.state.total + 1
    });
  }

  patchParams(page: number): void {
    const newParams = { ...this.state.params, page };

    this.patchState({ params: newParams });
  }

  updateStatus(status: boolean): void {
    this.spinner.show().then();

    this.albumsService.updateStatus(this.state.previewAlbum?.id, status).subscribe({
      next: res => {
        const previewAlbum = this.state.previewAlbum;
        if (previewAlbum) {
          previewAlbum.active = status;
        }

        this.patchState({ previewAlbum });
        this.toastService.addSuccess(res.message);
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  deleteImage(image: string, index: number): void {
    this.spinner.show().then();

    this.albumsService.deleteImage(this.state.previewAlbum?.id, image).subscribe({
      next: res => {
        // in the future be will return left images array
        let images = this.state.images;
        images?.images.splice(index, 1);
        if(images?.imagesCount) {
          images.imagesCount = images.imagesCount - 1;
        }
        this.toastService.addSuccess(res.message);
        this.patchState({ images });
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);        
        this.spinner.hide().then();
      }
    });
  }

  deleteMultipleImages(images: string[]): void {
    this.spinner.show().then();

    this.albumsService.deleteMultipleImages(this.state.previewAlbum?.id, images).subscribe({
      next: res => {
        let savedImages = this.state.images;
        for (const image of images) {
          if (savedImages) {
            const index = savedImages.images.findIndex(imImage => imImage.name === image);
            if (index >= 0) {
              savedImages?.images.splice(index, 1);
              if (savedImages) {
                savedImages.imagesCount = savedImages.imagesCount - 1;
              }
            }
          }
        }
        
        this.patchState({ images: savedImages });
        this.toastService.addSuccess(res.message);
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  disableMultipleImages(images: string[]): void {
    this.spinner.show().then();

    this.albumsService.disableMultipleImages(this.state.previewAlbum?.id, images).subscribe({
      next: res => {
        let savedImages = this.state.images;
        for (const image of images) {
          const index = savedImages?.images.findIndex(imImage => imImage.name === image);
          if (index) {
            if (savedImages) {
              savedImages.images[index].disabled = true;
            }
          } 
        }

        this.patchState({ images: savedImages });
        this.toastService.addSuccess(res.message);
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  enableMultipleImages(images: string[]): void {
    this.spinner.show().then();

    this.albumsService.enableMultipleImages(this.state.previewAlbum?.id, images).subscribe({
      next: res => {
        let savedImages = this.state.images;
        for (const image of images) {
          const index = savedImages?.images.findIndex(imImage => imImage.name === image);
          if (index) {
            if (savedImages) {
              savedImages.images[index].disabled = false;
            }
          } 
        }

        this.patchState({ images: savedImages });
        this.toastService.addSuccess(res.message);
        this.spinner.hide().then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    });
  }

  patchSelectedImages(images: Image[]): void {
    this.patchState({ selectedImages: images });
  }

  patchSelectedAdminImages(images: Image[]): void {
    this.patchState({ selectedAdminImages: images });
  }

  selectImages(): void {
    if (this.state.selectedImages) {
      this.spinner.show().then();

      this.albumsService.selectImages(this.state.previewAlbum?.id, this.state.selectedImages).subscribe({
        next: res => {
          this.toastService.addSuccess(res.message);
          this.spinner.hide().then();
        },
        error: error => {
          this.toastService.addError(error.error.message);       
          this.spinner.hide().then();
        }
      });
    }
  }

  deleteAlbum(id: string): void {
    this.spinner.show().then();
    this.albumsService.deleteAlbum(id).subscribe({
      next: res => {
        this.toastService.addSuccess(res.message);
        this.spinner.hide().then();
        this.router.navigate(['/bo/albums']).then();
      },
      error: error => {
        this.toastService.addError(error.error.message);
        this.spinner.hide().then();
      }
    })
  }
}
