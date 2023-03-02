import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { ClientsService } from '../../services/clients.service'
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Client } from '../../models/client.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ClientsStore } from '../../services/clients.store';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NewClientComponent } from '../new-client/new-client.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AlbumsService } from '../../../albums/services/albums.service';
import { Album } from '../../../albums/models/album.model';
import { NewAlbumComponent } from '../../../albums/containers/new-album/new-album.component';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ConfirmDialogModule,
    RouterModule
  ],
  providers: [ 
    ClientsStore,
    ConfirmationService,
    DialogService
  ],
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, OnDestroy {

  client: Client = {} as Client;
  id: string = '';
  isMobile: boolean = false;
  imageUrl: string = `${ environment.apiUrl }/images/`;

  clientAlbums: Album[] = [];

  @Input() modalWidth: string = '';

  client$: Observable<Client | null> = this.clientService.getSingleClient(this.id).pipe(
    catchError(err => {
      console.log(err);
      return of(null);
    })
  );

  constructor(
    private adminLayoutService: AdminLayoutService,
    private clientService: ClientsService,
    private route: ActivatedRoute,
    public location: Location,
    private toast: ToastService,
    private clientStore: ClientsStore,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private router: Router,
    private dialog: DialogService,
    private albumService: AlbumsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        this.id = params['id'];
        this.getClient();
        this.getClientAlbums();
      }
    });
    this.adminLayoutService.setTitle('common.clients');

    this.adminLayoutService.isMobile$.subscribe({
      next: res => {
        this.isMobile = res;
        this.modalWidth = this.isMobile ? '90%' : '40%';
      }
    });
  }

  ngOnDestroy(): void {
    this.adminLayoutService.resetDetail();
  }

  getClient(): void {
    this.clientService.getSingleClient(this.id).subscribe({
      next: client => {
        console.log('CLIENT', client);
        
        this.client = client;
      },
      error: err => {
        console.error(err);
        
      }
    });
  }

  getClientAlbums(): void {
    const params = {
      page: 1,
      take: 10
    }
    this.albumService.getUserAlbums(this.id, params).subscribe({
      next: res => {
        console.log('CLIENT ALBUMS', res);
        this.clientAlbums = res.list;
      }
    })
  }

  openAddModal(): void {
    const ref = this.dialog.open(NewAlbumComponent, {
      width: this.modalWidth,
      header: this.translate.instant('albums.addNewAlbum')
    });

    ref.onClose.subscribe({
      next: res => {
        if (res === 'new') {
          this.getClientAlbums();
        }
      }
    });

  }

  onEditClient(): void {
    const ref = this.dialog.open(NewClientComponent, {
      width: this.modalWidth,
      data: this.client,
      header: this.translate.instant('clients.editClient')
    });

    ref.onClose.subscribe({
      next: res => {
        if(res === 'update'){
          this.getClient();
        }
      }
    })
  }

  deleteClient(event: any): void { 
    event.stopPropagation();

    this.confirmationService.confirm({
      key: 'delete',
      message: this.translate.instant('messages.deleteClient'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        this.clientStore.deleteClient(this.client);
        this.router.navigate(['/bo/home/clients'])
      }
    });
  }

  changeStatus(event: any, status: string): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      key: 'changeStatus',
      message: this.translate.instant('messages.changeAccountStatus'),
      acceptButtonStyleClass: 'btn btn__red text',
      rejectButtonStyleClass: 'btn btn__dark text',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        if (status === 'ACTIVE') {
          this.clientStore.suspendClientAccount(this.client);
          this.getClient();
        } else if (status = 'SUSPENDED') {
          this.clientStore.activateClientAccount(this.client);
          this.getClient();
        }
      }

    });
    this.getClient()
  }
}
