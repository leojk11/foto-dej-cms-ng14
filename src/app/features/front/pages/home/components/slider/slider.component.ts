import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { SwiperOptions } from 'swiper';
import { environment } from 'src/environments/environment';
import { FrontConfigurationService } from '../../services/front-configuration.service';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    CommonModule,
    SwiperModule,
  ],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  imagesUrl: string = `${ environment.apiUrl }/images/`;
  promoImages: any;

  config: SwiperOptions = {
    slidesPerView: 2.4,
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
    this.service.getConfiguration().subscribe({
      next: res => {
        console.log('CONFIG RES', res);
        this.promoImages = res.promo_images; 
        
      }
    })
  }

  onSwiper(swiper:any) {
    console.log(swiper);
  }

  onSlideChange(event: any) {
    console.log('slide change', event);
  }

}
