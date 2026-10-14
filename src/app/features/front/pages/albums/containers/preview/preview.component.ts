import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AlbumsStore } from 'src/app/features/bo/pages/albums/services/albums.store';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslatePipe } from '@ngx-translate/core';
import { AlbumPreviewComponent } from 'src/app/shared/components/album-preview/album-preview.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-preview',
    imports: [
        CommonModule,
        TranslatePipe,
        AlbumPreviewComponent
    ],
    providers: [AlbumsStore, ConfirmationService],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './preview.component.html'
})
export class PreviewComponent implements OnInit {

  albumId: string = '';

  public isAdmin: boolean = true;

  constructor(
    public store: AlbumsStore,
    private route: ActivatedRoute,
    public location: Location,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('auth user', this.authService.user);
    if (this.authService.user) {
      if (this.authService.user.role === 'CLIENT') {
        this.isAdmin = false;
      }
    }
    
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
