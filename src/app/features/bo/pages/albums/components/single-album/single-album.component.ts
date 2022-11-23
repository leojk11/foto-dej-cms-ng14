import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Album } from '../../models/album.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-album.component.html',
  styleUrls: ['./single-album.component.scss']
})
export class SingleAlbumComponent implements OnInit {

  @Input() album: Album | null = null;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToPreview(): void {
    this.router.navigate(['/bo/home/albums/' + this.album?.id]).then();
  }
}
