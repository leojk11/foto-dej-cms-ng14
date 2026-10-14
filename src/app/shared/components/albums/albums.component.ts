import { RevealDirective } from 'src/app/shared/directives/reveal.directive';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AlbumsStore } from '../../../features/bo/pages/albums/services/albums.store';
import { SingleAlbumComponent } from '../single-album/single-album.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NewAlbumComponent } from '../../../features/bo/pages/albums/containers/new-album/new-album.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminLayoutService } from 'src/app/features/bo/layout/services/admin-layout.service';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { PermitDirective } from 'src/app/core/directives/permit.directive';
import { PopoverModule } from 'primeng/popover';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-albums',
    imports: [
        RevealDirective,
        CommonModule,
        SingleAlbumComponent,
        TranslatePipe,
        PaginatorModule,
        InputTextModule,
        PermitDirective,
        PopoverModule,
        FormsModule
    ],
    providers: [
        AlbumsStore,
        DialogService
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './albums.component.html'
})
export class AlbumsComponent implements OnInit {

  @Input() isAdmin: boolean = false;
  @Input() userId: string = '';

  modalWidth: string = '';
  nameSearch: string = '';
  dateSearch: string = '';
  isMobile: boolean = false;
  searchTerms: string[] = [];

  constructor(
    private adminLayoutService: AdminLayoutService,
    public albumStore: AlbumsStore,
    private dialog: DialogService,
    private translate: TranslateService,
    public location: Location
  ) { }

  ngOnInit(): void {
    if( this.isAdmin ) {
      this.albumStore.getAllAlbums();
    } else {
      this.albumStore.getUserAlbums(this.userId);
    }
    
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
      dismissableMask: true,
      closable: true,
      width: this.modalWidth,
      header: this.translate.instant('albums.addNewAlbum')
    });
  }

  onPageChange(event: any): void {
    this.albumStore.patchParams(event.page + 1);

    if( this.isAdmin ) {
      this.albumStore.getAllAlbums();
    } else {
      this.albumStore.getUserAlbums(this.userId);
    }
  }

  filter(): void{
    if(this.nameSearch !== '' && this.dateSearch === ''){
      this.albumStore.patchState({
        params: {
          ...this.albumStore.snapshot.params,
          title: this.nameSearch
        }
      });

      this.searchTerms.push(this.nameSearch);

    } else if(this.dateSearch !== '' && this.nameSearch === ''){
      this.albumStore.patchState({
        params: {
          ...this.albumStore.snapshot.params,
          date: this.dateSearch
        }
      });

      this.searchTerms.push(this.dateSearch);

    } else if(this.dateSearch !== '' && this.nameSearch !== ''){
      this.albumStore.patchState({
        params: {
          ...this.albumStore.snapshot.params,
          title: this.nameSearch,
          date: this.dateSearch
        }
      });
      this.searchTerms.push(this.nameSearch);
      this.searchTerms.push(this.dateSearch);
    } else {
      this.albumStore.patchState({
        params: {
          page: this.albumStore.snapshot.params.page,
          take: this.albumStore.snapshot.params.take
        }
      });
    }

    if( this.isAdmin ) {
      this.albumStore.getAllAlbums();
    } else {
      this.albumStore.getUserAlbums(this.userId);
    }
  }

  clearFilter(): void {
    this.nameSearch = '';
    this.dateSearch = '';
    this.searchTerms = [];

    this.filter();
  }

  clearTerm(index: number): void {
    const term = this.searchTerms.splice(index, 1)[0];
    console.log(term);

    if(term === this.nameSearch) {
      this.nameSearch = '';
    } else if (term === this.dateSearch) {
      this.dateSearch = '';
    }

    this.filter();
  }
}
