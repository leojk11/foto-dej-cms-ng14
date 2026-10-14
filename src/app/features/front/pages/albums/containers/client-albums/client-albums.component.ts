import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { AlbumComponent } from 'src/app/shared/components/album/album.component';
import { AlbumsStore } from 'src/app/features/bo/pages/albums/services/albums.store';
import { ConfirmationService } from 'primeng/api';
import { SingleAlbumComponent } from 'src/app/shared/components/single-album/single-album.component';
import { PaginatorModule } from 'primeng/paginator';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlbumsComponent } from 'src/app/shared/components/albums/albums.component';

@Component({
    selector: 'app-client-albums',
    imports: [
    AlbumComponent,
    SingleAlbumComponent,
    PaginatorModule,
    AlbumsComponent
],
    providers: [AlbumsStore, ConfirmationService],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './client-albums.component.html'
})
export class ClientAlbumsComponent implements OnInit {

  userId: string = '';

  constructor(
    public store: AlbumsStore,
    private authState: AuthService
  ) { }

  ngOnInit(): void {
    this.store.getUserAlbums(this.authState.user.id);
    this.userId = this.authState.user.id;
  }
}
