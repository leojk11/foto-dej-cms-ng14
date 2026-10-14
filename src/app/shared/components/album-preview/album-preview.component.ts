import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { AlbumsState } from 'src/app/features/bo/pages/albums/services/albums.store';
import { SpinnerComponent } from '../loading/spinner/spinner.component';
import { AlbumComponent } from '../album/album.component';

@Component({
    selector: 'app-album-preview',
    imports: [
    SpinnerComponent,
    AlbumComponent
],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './album-preview.component.html'
})
export class AlbumPreviewComponent implements OnInit {

  @Input() public state: AlbumsState = {} as AlbumsState;
  @Input() public albumId: string = '';
  @Input() public isAdmin: boolean = true;

  constructor( ) { }

  ngOnInit(): void {
  }

}
