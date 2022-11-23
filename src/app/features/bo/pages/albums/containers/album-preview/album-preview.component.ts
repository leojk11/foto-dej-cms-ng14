import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsStore } from '../../services/albums.store';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { NewAlbumComponent } from '../new-album/new-album.component';
import { TranslateModule } from '@ngx-translate/core';
import { SingleImageComponent } from '../../components/single-image/single-image.component';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';


@Component({
  selector: 'app-album-preview',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SpinnerComponent,
    SingleImageComponent
  ],
  providers: [
    AlbumsStore,
    DialogService
  ],
  templateUrl: './album-preview.component.html',
  styleUrls: ['./album-preview.component.scss']
})
export class AlbumPreviewComponent implements OnInit {

  constructor(
    public albumsStore: AlbumsStore,
    private adminLayoutService: AdminLayoutService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: DialogService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        if(params['id']) {
          this.albumsStore.getSingleAlbum(params['id']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.adminLayoutService.resetDetail();
  }

  goToUpload(): void {
    this.router.navigate(['/bo/home/albums/upload/' + this.albumsStore.state.previewAlbum?.id]).then();
  }

  deleteImage(event: string, index: number): void {
    this.albumsStore.deleteImage(event, index);
  }

  openEditModal(): void {
    this.dialog.open(NewAlbumComponent,{
      width: '60%',
      height: '50%',
      data: this.albumsStore.state.previewAlbum
    });
  }

}
