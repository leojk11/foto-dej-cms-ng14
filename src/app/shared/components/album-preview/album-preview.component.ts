import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsState, AlbumsStore } from 'src/app/features/bo/pages/albums/services/albums.store';
import { SpinnerComponent } from '../loading/spinner/spinner.component';
import { AlbumComponent } from '../album/album.component';
import { Image } from 'src/app/features/bo/pages/albums/models/image.model';

@Component({
  selector: 'app-album-preview',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    AlbumComponent
  ],
  templateUrl: './album-preview.component.html'
})
export class AlbumPreviewComponent implements OnInit {

  @Input() state: AlbumsState = {} as AlbumsState;
  @Input() albumId: string = '';

  constructor(
    private store: AlbumsStore
  ) { }

  ngOnInit(): void {
  }

}
