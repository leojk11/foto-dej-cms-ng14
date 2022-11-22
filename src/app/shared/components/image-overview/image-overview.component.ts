import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageOverviewService } from '../../services/image-overview.service';

@Component({
  selector: 'app-image-overview',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './image-overview.component.html',
  styleUrls: ['./image-overview.component.scss']
})
export class ImageOverviewComponent implements OnInit, OnDestroy {

  @Input() image: string = '';
  @Input() images?: string [] = [];

  @Input() configuration?: any = {};

  constructor(
    public imageOverviewState: ImageOverviewService
  ) { }

  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    this.imageOverviewState.resetState();
  }
}
