import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { ImageOverviewService } from '../../services/image-overview.service';
import { SpinnerComponent } from '../loading/spinner/spinner.component';

@Component({
    selector: 'front-single-image',
    imports: [SpinnerComponent],
    templateUrl: './front-single-image.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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
