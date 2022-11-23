import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsStore } from '../../services/albums.store';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { SingleAlbumComponent } from '../../components/single-album/single-album.component';
import { TranslateModule } from '@ngx-translate/core';
import { NewAlbumComponent } from '../new-album/new-album.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';


@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    SingleAlbumComponent,
    TranslateModule
  ],
  providers: [
    AlbumsStore,
    DialogService
  ],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {

  constructor(
    private adminLayoutService: AdminLayoutService,
    public albumStore: AlbumsStore,
    private dialog: DialogService
  ) { }

  ngOnInit(): void {
    this.albumStore.getAllAlbums();
    this.albumStore.resetPreview();
    this.adminLayoutService.setTitle('common.albums');
  }

  openAddModal(): void {
    this.dialog.open(NewAlbumComponent, {
      width: '60%',
      // height: '50%'
    } );
  }
}
