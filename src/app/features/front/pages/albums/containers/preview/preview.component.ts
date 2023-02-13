import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsStore } from 'src/app/features/bo/pages/albums/services/albums.store';
import { AlbumComponent } from 'src/app/shared/components/album/album.component';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { Image } from 'src/app/features/bo/pages/albums/models/image.model';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    CommonModule,
    AlbumComponent,
    SpinnerComponent
  ],
  providers: [AlbumsStore, ConfirmationService],
  templateUrl: './preview.component.html'
})
export class PreviewComponent implements OnInit {

  albumId: string = '';

  constructor(
    public store: AlbumsStore,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        console.log('PARAMS', params);
        
        if(params['id']) {
          this.albumId = params['id'];
          this.store.getSingleAlbum(params['id']);
          console.log('ID', params['id']);
          
        }
      }
    });
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
