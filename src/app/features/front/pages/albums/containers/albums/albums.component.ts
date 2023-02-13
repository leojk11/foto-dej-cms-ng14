import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumComponent } from 'src/app/shared/components/album/album.component';
import { AlbumsStore } from 'src/app/features/bo/pages/albums/services/albums.store';
import { Image } from 'src/app/features/bo/pages/albums/models/image.model';
import { ConfirmationService } from 'primeng/api';
import { SingleAlbumComponent } from 'src/app/shared/components/single-album/single-album.component';
import { PaginatorModule } from 'primeng/paginator';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [
    CommonModule,
    AlbumComponent,
    SingleAlbumComponent,
    PaginatorModule,
    SpinnerComponent
  ],
  providers: [ AlbumsStore, ConfirmationService ],
  templateUrl: './albums.component.html',
})
export class AlbumsComponent implements OnInit {
  userId: string = '';

  constructor(
    public store: AlbumsStore,
    private authState: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = this.authState.user.id
    console.log('ID', this.authState.user);
    
    this.store.getUserAlbums(this.userId);
  }

  onPageChange(event: any): void {
    console.log(event);
    this.store.patchParams(event.page + 1);
    this.store.getAllAlbums();
  }

  filter(image: string): void {
    // this.store.getAlbumImages(this.albumId, image);
  }

  onImageSelect(event: { images: Image[]; isAdmin: boolean }): void {
    this.store.patchSelectedImages(event.images);

    if (!event.isAdmin) {
      this.store.selectImages();
    }
  }

}
