import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { ToastrService } from 'ngx-toastr';
import { BasicParams } from 'src/app/shared/models/basicParams.model';
import { AdminLayoutService } from '../../../layout-admin/services/admin-layout.service';
import { Client } from '../../clients/models/client.model';
import { Album } from '../models/album.model';
import { AlbumsService } from './albums.service';
import {Image} from "../models/image.model";
import {GetAlumImagesResponse} from "../models/getAlumImagesResponse.model";

export interface AlbumsState {
  list: Album[],
  params: BasicParams,
  total: number;

  images: GetAlumImagesResponse | null;

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
    private toastService: ToastrService,
    private router: Router,
    private albumLayoutService: AdminLayoutService
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
        this.toastService.error(error.error.message);
      }
    });
  }

  getSingleAlbum(id: string): void {
    this.setLoading(true);

    this.albumsService.getSingleAlbum(id).subscribe({
      next: singleAlbum => {
        console.log('Single album', singleAlbum);
        this.albumsService.getAlbumImages(id).subscribe({
          next: albumImages => {
            this.albumLayoutService.setTitle('common.albums', `${ singleAlbum.title }`);

            this.patchState({
              previewAlbum: singleAlbum,
              images: albumImages,
              loading: false
            });
          },
          error: error => {
            this.setLoading(false);
            this.toastService.error(error.error.message);
          }
        });
      },
      error: error => {
        this.setLoading(false);
        this.toastService.error(error.error.message);
      }
    });
  }

  patchPreviewAlbum(album: Album): void {
    this.patchState({
      previewAlbum: album
    });
  }

  patchExistingAlbums(newAlbum: Album): void {
    const list = this.state.list;
    list.push(newAlbum);

    this.patchState({
      list,
      total: this.state.total + 1
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
        this.toastService.success('Images has been deleted');
        this.patchState({ images });
      },
      error: error => {
        this.toastService.error(error.error.message);
      }
    });

  }
}
