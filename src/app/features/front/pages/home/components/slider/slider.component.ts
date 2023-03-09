import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { SwiperOptions, Navigation } from 'swiper';
import { environment } from 'src/environments/environment';
import { FrontConfigurationService } from '../../../../../../shared/services/front-configuration.service';
import {CarouselModule} from 'primeng/carousel';

SwiperCore.use([Navigation])
@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    CommonModule,
    SwiperModule,
    CarouselModule
  ],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input() promoImages: string = '';
  @Input() imageUrl: string = '';

  imagesUrl: string = `${ environment.apiUrl }/images/`;
  // promoImages: any;

  config: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 45,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    centeredSlides: true,
    centeredSlidesBounds: true,
    loop: true
  };

  constructor(
    private service: FrontConfigurationService
  ) { }

  ngOnInit(): void {
    // this.service.getConfiguration().subscribe({
    //   next: res => {
    //     this.promoImages = res.promo_images; 
    //   }
    // });
  }
}
