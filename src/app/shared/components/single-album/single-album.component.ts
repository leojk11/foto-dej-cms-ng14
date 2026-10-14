import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Album } from '../../../features/bo/pages/albums/models/album.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-single-album',
    imports: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './single-album.component.html'
})
export class SingleAlbumComponent implements OnInit {

  @Input() album: Album | null = null;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToPreview(): void {
    // decided by the current route: the stored user's role can be missing, or belong to a
    // different session, which sent clients to the guarded bo routes (and the bo login page)
    const base = this.router.url.startsWith('/client') ? '/client/albums/' : '/bo/albums/';
    this.router.navigate([base + this.album?.id]).then();
  }
}
