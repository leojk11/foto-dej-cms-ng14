import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsStore } from '../../services/albums.store';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { NewAlbumComponent } from '../new-album/new-album.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SingleImageComponent } from '../../components/single-image/single-image.component';
import { SpinnerComponent } from 'src/app/shared/components/loading/spinner/spinner.component';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AlbumsService } from '../../services/albums.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ImageOverviewService, ImageOverviewState } from 'src/app/shared/services/image-overview.service';

@Component({
  selector: 'app-album-preview',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SpinnerComponent,
    SingleImageComponent,
    TooltipModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  providers: [
    AlbumsStore,
    DialogService,
    ConfirmationService
  ],
  templateUrl: './album-preview.component.html',
  styleUrls: ['./album-preview.component.scss']
})
export class AlbumPreviewComponent implements OnInit {

  albumId: string = '';
  modalWidth: string = '';
  isMobile: boolean = false;

  constructor(
    public albumsStore: AlbumsStore,
    private adminLayoutService: AdminLayoutService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: DialogService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private albumsService: AlbumsService,
    private toastService: ToastService,
    private imageOverviewState: ImageOverviewService
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
    this.router.navigate(['/bo/home/albums/upload/' + this.albumsStore.state.previewAlbum?.id]).then();
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
        this.albumsService.deleteAlbum(this.albumId).subscribe({
          next: res => {
            this.toastService.addSuccess(res.message);
            this.router.navigate(['/bo/home/albums']).then();
          },
          error: error => {
            this.toastService.addError(error.error.message);
          }
        })
      }
    });
  }

  deleteImage(event: string, index: number): void {
    this.confirmationService.confirm({
      key: 'deleteImage',
      message: this.translate.instant('messages.deleteImage'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        this.albumsStore.deleteImage(event, index);
      }
    });
  }

  openEditModal(): void {
    const ref = this.dialog.open(NewAlbumComponent, {
      width: this.modalWidth,
      header: this.translate.instant('albums.addNewAlbum'),
      data: this.albumsStore.state.previewAlbum
    });

    ref.onClose.subscribe({
      next: res => {
        if(res === 'update'){
          this.albumsStore.getSingleAlbum(this.albumId)
        }
      }
    });
  }

  onToggleOverview(event: any, images: any): void {
    const imagesArr = [];
    for (const image of images) {
      imagesArr.push(image.name);
    }
    
    this.imageOverviewState.toggleOverview();
    this.imageOverviewState.setImages(event, imagesArr);
  }

}
