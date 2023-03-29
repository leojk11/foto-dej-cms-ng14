import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsState } from 'src/app/features/bo/pages/albums/services/albums.store';
import { SpinnerComponent } from '../loading/spinner/spinner.component';
import { AlbumComponent } from '../album/album.component';

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

  constructor( ) { }

  ngOnInit(): void {
  }

}
