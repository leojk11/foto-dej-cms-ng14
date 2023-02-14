import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AlbumsStore } from 'src/app/features/bo/pages/albums/services/albums.store';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { AlbumPreviewComponent } from 'src/app/shared/components/album-preview/album-preview.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AlbumPreviewComponent
  ],
  providers: [AlbumsStore, ConfirmationService],
  templateUrl: './preview.component.html'
})
export class PreviewComponent implements OnInit {

  albumId: string = '';

  constructor(
    public store: AlbumsStore,
    private route: ActivatedRoute,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        if(params['id']) {
          this.albumId = params['id'];
          this.store.getSingleAlbum(params['id']);
        }
      }
    });
  }

}
