import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Album } from '../../../features/bo/pages/albums/models/album.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { PermissionsType } from 'src/app/core/data/permissions.enum';

@Component({
  selector: 'app-single-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-album.component.html'
})
export class SingleAlbumComponent implements OnInit {

  @Input() album: Album | null = null;

  constructor(
    private router: Router,
    private authStore: AuthService
  ) { }

  ngOnInit(): void {
  }

  goToPreview(): void {
    const role = this.authStore.user.role;
    if(role === PermissionsType.CLIENT){
      this.router.navigate(['/client/albums/' + this.album?.id]).then();
    } else {
      this.router.navigate(['/bo/home/albums/' + this.album?.id]).then();
    }
  }
}
