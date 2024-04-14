import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

import 'hammerjs';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {

  @Input() promoImages: string[] = [];
  @Input() imageUrl: string = '';

  selectedIndex: number = 0;

  imagesUrl: string = `${ environment.apiUrl }/images/`;

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
