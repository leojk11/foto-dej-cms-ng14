import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { AlbumsStore } from '../../services/albums.store';
import { AlbumsComponent } from 'src/app/shared/components/albums/albums.component';

@Component({
    selector: 'app-bo-albums',
    imports: [
    AlbumsComponent
],
    providers: [AlbumsStore],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<app-albums [isAdmin]="true"></app-albums>`
})
export class BoAlbumsComponent implements OnInit {

  constructor(
    public store: AlbumsStore
  ) { }

  ngOnInit(): void {
  }

}
