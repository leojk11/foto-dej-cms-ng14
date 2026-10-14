import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-slider',
    imports: [
        CommonModule
    ],
    templateUrl: './slider.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./slider.component.scss']
})
export class SliderComponent {

  @Input() promoImages: string[] = [];
  @Input() imageUrl: string = '';

  selectedIndex: number = 0;

  imagesUrl: string = `${ environment.apiUrl }/images/`;

  private static readonly PAN_THRESHOLD = 10;

  private panStartX: number | null = null;
  private justPanned: boolean = false;

  onPanStart(event: PointerEvent): void {
    this.panStartX = event.clientX;
    this.justPanned = false;
  }

  onImageClick(index: number): void {
    // a drag ends with a click on the same image, which must not undo the swipe
    if (this.justPanned) {
      this.justPanned = false;
      return;
    }

    this.select(index);
  }

  onPanMove(event: PointerEvent, index: number): void {
    if (this.panStartX === null) {
      return;
    }

    const deltaX = event.clientX - this.panStartX;

    if (Math.abs(deltaX) < SliderComponent.PAN_THRESHOLD) {
      return;
    }

    this.panStartX = null;
    this.justPanned = true;

    if (deltaX > 0) {
      this.showPrev(index);
    } else {
      this.showNext(index);
    }
  }

  onPanEnd(): void {
    this.panStartX = null;
  }

  select(index: number): void {
    if (index >= 0 && index < this.promoImages.length) {
      this.selectedIndex = index;
    }
  }

  showPrev(index: number): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex = index - 1;
    }
  }

  showNext(index: number): void {
    if (this.selectedIndex < this.promoImages.length - 1) {
      this.selectedIndex = index + 1;
    }
  }
}
