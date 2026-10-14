import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AlbumsStore } from '../../services/albums.store';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { NewAlbumComponent } from '../new-album/new-album.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SingleImageComponent } from '../../components/single-image/single-image.component';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AlbumPreviewComponent } from 'src/app/shared/components/album-preview/album-preview.component';

@Component({
    selector: 'app-bo-preview',
    imports: [
        CommonModule,
        FormsModule,
        TranslatePipe,
        SingleImageComponent,
        TooltipModule,
        ButtonModule,
        ConfirmDialogModule,
        ToggleSwitchModule,
        InputTextModule,
        AlbumPreviewComponent
    ],
    providers: [
        AlbumsStore,
        DialogService,
        ConfirmationService
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './bo-preview.component.html'
})
export class BoPreviewComponent implements OnInit {

  albumId: string = '';
  modalWidth: string = '';
  isMobile: boolean = false;

  selectedImages: string[] = [];
  imageSearch: string = '';

  constructor(
    public albumsStore: AlbumsStore,
    public location: Location,
    private adminLayoutService: AdminLayoutService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: DialogService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        if(params['id']) {
          this.albumId = params['id'];
          this.albumsStore.getSingleAlbum(params['id']);
        }
      }
    });

    this.adminLayoutService.isMobile$.subscribe(res =>{ 
      this.isMobile = res;
      this.modalWidth = this.isMobile ? '90%' : '40%';
    });
  }

  ngOnDestroy(): void {
    this.adminLayoutService.resetDetail();
  }

  goToUpload(): void {
    this.router.navigate(['/bo/albums/upload/' + this.albumsStore.snapshot.previewAlbum?.id]).then();
  }

  changeStatus(event: any): void {
    this.albumsStore.updateStatus(event.checked);
  }

  deleteAlbum(): void {
    this.confirmationService.confirm({
      key: 'delete',
      message: this.translate.instant('messages.deleteAlbum'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        this.albumsStore.deleteAlbum(this.albumId);
      }
    });
  }

  openEditModal(): void {
    this.dialog.open(NewAlbumComponent, {
      dismissableMask: true,
      closable: true,
      width: this.modalWidth,
      header: this.translate.instant('albums.editAlbum'),
      data: this.albumsStore.snapshot.previewAlbum
    });
  }
}
