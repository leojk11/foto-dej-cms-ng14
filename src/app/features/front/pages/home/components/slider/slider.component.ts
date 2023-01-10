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
    loop: true,
    // breakpoints: {
    //   320: {
    //     slidesPerView: 2.5,
    //     spaceBetween: 45
    //   },
    //   // when window width is >= 480px
    //   480: {
    //     slidesPerView: 2.5,
    //     spaceBetween: 45
    //   },
    //   // when window width is >= 640px
    //   640: {
    //     slidesPerView: 2.5,
    //     spaceBetween: 45
    //   },
    //   1400: {
    //     slidesPerView: 3,
    //     spaceBetween: 45
    //   }
    // }
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

  onSlideChange() {
    console.log('slide change');
  }

}
