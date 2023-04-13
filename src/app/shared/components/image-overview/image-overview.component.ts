import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
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

  @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        this.imageOverviewState.closeOverview();
      }
      if (event.key === 'ArrowLeft') {
        this.imageOverviewState.changeImage('prev');
      }
      if (event.key === 'ArrowRight') {
        this.imageOverviewState.changeImage('next');
      }
    }

  constructor(
    public imageOverviewState: ImageOverviewService
  ) { }

  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    this.imageOverviewState.resetState();
  }
}
