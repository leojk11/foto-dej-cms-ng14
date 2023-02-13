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

export interface AlbumsState {
  list: Album[],
  params: BasicParams,
  total: number;

  images: GetAlumImagesResponse | null;
  selectedImages: Image[];

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
    take: 6 // 20 just to test
  },
  total: 0,

  images: null,
  selectedImages: [],

  loading: true,

  previewAlbum: null,

  clients: [],
  clientsTotal: 0,
  clientsParams: {
    page: 1,
    take: 10
  }
};

@Injectable()
export class AlbumsStore extends ComponentStore<AlbumsState> {

  constructor(
    private albumsService: AlbumsService,
    private router: Router,
    private adminLayoutService: AdminLayoutService,
    private toastService: ToastService
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
    this.setLoading(true);

    this.albumsService.getAllAlbums(this.state.params).subscribe({
      next: res => {
        console.log('albums response', res);

        this.patchState({
          list: res.list,
          total: res.total,

          loading: false
        });
      },
      error: error => {
        this.setLoading(false);
        this.toastService.addError(error.error.message);
      }
    });
  }

  getUserAlbums(userId: string): void {
    this.setLoading(true);

    this.albumsService.getUserAlbums(userId, this.state.params).subscribe({
      next: res => {
        console.log('USER ALBUMS RES', res);

        this.patchState({
          list: res.list,
          total: res.total,

          loading: false
        });
      },
      error: error => {
        this.setLoading(false);
        this.toastService.addError(error.error.message);
      }
    });
  }

  getSingleAlbum(id: string, image?: string): void {
    this.setLoading(true);

    this.albumsService.getSingleAlbum(id).subscribe({
      next: singleAlbum => {
        this.albumsService.getAlbumImages(id, image).subscribe({
          next: albumImages => {
            this.albumsService.getSelectedAlbumImages(id).subscribe({
              next: selectedImages => {
                this.adminLayoutService.setTitle('common.albums', `${ singleAlbum.title } (${singleAlbum.date})`);
                console.log('SELECTED IMAGES', selectedImages);
                
                this.patchState({
                  previewAlbum: singleAlbum,
                  images: albumImages,
                  // selectedImages: selectedImages.images,
                  loading: false
                });
              },
              error: error => {
                this.setLoading(false);
                this.toastService.addError(error.error.message);
              }
            });
          },
          error: error => {
            this.setLoading(false);
            this.toastService.addError(error.error.message);
          }
        });
      },
      error: error => {
        this.setLoading(false);
        this.toastService.addError(error.error.message);
      }
    });
  }

  getAlbumImages(id: string, image?: string): void {
    this.albumsService.getAlbumImages(id, image).subscribe({
      next: albumImages => {
        this.patchState({ images: albumImages });
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  getSelectedAlbumImages(albumId: string | undefined, image?: string): void {
    this.albumsService.getSelectedAlbumImages(albumId, image).subscribe({
      next: selectedImages => {
        this.patchState({ selectedImages: selectedImages.images });
      },
      error: error => {
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
    this.albumsService.updateStatus(this.state.previewAlbum?.id, status).subscribe({
      next: res => {
        const previewAlbum = this.state.previewAlbum;
        if (previewAlbum) {
          previewAlbum.active = status;
        }

        this.patchState({ previewAlbum });
        this.toastService.addSuccess(res.message);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  deleteImage(image: string, index: number): void {
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
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  deleteMultipleImages(images: string[]): void {
    this.albumsService.deleteMultipleImages(this.state.previewAlbum?.id, images).subscribe({
      next: res => {
        let savedImages = this.state.images;
        for (const image of images) {
          const index = savedImages?.images.findIndex(imImage => imImage.name === image);
          if (index) {
            savedImages?.images.splice(index, 1);
            if (savedImages) {
              savedImages.imagesCount = savedImages.imagesCount - 1;
            }
          }
        }

        this.patchState({ images: savedImages });
        this.toastService.addSuccess(res.message);
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  disableMultipleImages(images: string[]): void {
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
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  enableMultipleImages(images: string[]): void {
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
      },
      error: error => {
        this.toastService.addError(error.error.message);
      }
    });
  }

  patchSelectedImages(images: Image[]): void {
    this.patchState({ selectedImages: images });
  }

  selectImages(): void {
    if (this.state.selectedImages) {
      this.albumsService.selectImages(this.state.previewAlbum?.id, this.state.selectedImages).subscribe({
        next: res => {
          this.toastService.addSuccess(res.message);
        },
        error: error => {
          this.toastService.addError(error.error.message);
        }
      });
    }
  }
}
