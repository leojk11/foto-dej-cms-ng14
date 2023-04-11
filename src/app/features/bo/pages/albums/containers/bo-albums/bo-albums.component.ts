import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsStore } from '../../services/albums.store';
import { AlbumsComponent } from 'src/app/shared/components/albums/albums.component';

@Component({
  selector: 'app-bo-albums',
  standalone: true,
  imports: [
    CommonModule,
    AlbumsComponent
  ],
  providers: [AlbumsStore],
  template: `<app-albums [isAdmin]="true"></app-albums>`
})
export class BoAlbumsComponent implements OnInit {

  constructor(
    public store: AlbumsStore
  ) { }

  ngOnInit(): void {
    this.store.getAllAlbums();
  }

}
