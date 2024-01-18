import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageOverviewService } from '../../services/image-overview.service';
import { SpinnerComponent } from '../loading/spinner/spinner.component';

@Component({
  selector: 'front-single-image',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './front-single-image.component.html',
  styleUrls: ['./front-single-image.component.scss']
})
export class FrontSingleImageComponent implements OnInit {

  @Input() imagesUrl: string | null = null;
  @Input() image: string | null = null;
  @Input() imagesToDisplay: string[] | undefined = [];

  loaded: boolean = false;

  constructor(
    private imageOverviewService: ImageOverviewService
  ) { }

  ngOnInit(): void {
  }

  onLoad(): void {
    this.loaded = true;
  }

  toggleOverview(event: any, images: any): void {
    if (this.imagesToDisplay) {
      this.imageOverviewService.toggleOverview();
      this.imageOverviewService.setImages(event.target.src, images);
    }
  }

}
