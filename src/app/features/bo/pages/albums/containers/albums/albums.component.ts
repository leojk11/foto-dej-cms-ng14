import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsStore } from '../../services/albums.store';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { SingleAlbumComponent } from '../../components/single-album/single-album.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewAlbumComponent } from '../new-album/new-album.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { PaginatorModule } from 'primeng/paginator';
import { tap } from 'rxjs';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    SingleAlbumComponent,
    TranslateModule,
    PaginatorModule
  ],
  providers: [
    AlbumsStore,
    DialogService
  ],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {

  modalWidth: string = '';
  isMobile: boolean = false;

  constructor(
    private adminLayoutService: AdminLayoutService,
    public albumStore: AlbumsStore,
    private dialog: DialogService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.albumStore.getAllAlbums();
    this.albumStore.resetPreview();
    this.adminLayoutService.setTitle('common.albums');

    this.adminLayoutService.isMobile$.subscribe(res =>{ 
      this.isMobile = res;
      console.log('IS MOBILE', this.isMobile);
      this.modalWidth = this.isMobile ? '90%' : '40%';
    });
  }

  openAddModal(): void {
    this.dialog.open(NewAlbumComponent, {
      width: this.modalWidth,
      header: this.translate.instant('albums.addNewAlbum')
      // height: '50%'
    } );
  }

  onPageChange(event: any): void {
    console.log(event);
    this.albumStore.patchParams(event.page + 1);
    this.albumStore.getAllAlbums();
  }
}
