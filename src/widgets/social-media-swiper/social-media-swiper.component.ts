import { Component, HostListener, OnInit, OnDestroy, Input } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { FadeInOutAnimation } from '../../app/app.animations';
import { ContentfulService } from 'src/services/contentful.service';

@Component({
  selector: 'app-social-media-swiper',
  templateUrl: './social-media-swiper.component.html',
  styleUrls: ['./social-media-swiper.component.scss'],
  animations: [FadeInOutAnimation],
})
export class SocialMediaSwiperComponent implements OnInit, OnDestroy {
  @Input() public pageId: string;
  public fullContent = false;
  public socialswiperConfig: SwiperConfigInterface = {
    centeredSlides: true,
    autoplay: {
      delay: 10000, // 10 seconds
      disableOnInteraction: false
    },
    speed: 1000,
    direction: 'horizontal',
    slidesPerView: 2,
    keyboard: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.slider-pagination',
      renderBullet: (index, className) => {
        return `<li style="z-index: 10" class="slick-active ${className}"><button ></button></li>`;
      },
      clickable: true
    },
    observer: true,
    loop: true,
    zoom: {
      toggle: false
    },
    setWrapperSize: false
  };

  public socialswiperRespoConfig: SwiperConfigInterface = {
    centeredSlides: true,
    autoplay: {
      delay: 10000, // 10 seconds
      disableOnInteraction: false
    },
    speed: 1000,
    direction: 'vertical',
    slidesPerView: 1,
    keyboard: true,
    observer: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.slider-pagination',
      renderBullet: (index, className) => {
        return `<li style="z-index: 10" class="slick-active ${className}"><button ></button></li>`;
      },
      clickable: true
    },
    loop: true,
    zoom: {
      toggle: false
    },
    setWrapperSize: false,
  };
  public socialswiperMobConfig: SwiperConfigInterface = {
    centeredSlides: true,
    autoplay: {
      delay: 7000, // 7 seconds
      disableOnInteraction: false
    },
    speed: 1000,
    slidesPerView: 1,
    keyboard: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.slider-pagination',
      renderBullet: (index, className) => {
        return `<li style="z-index: 10" class="slick-active ${className}"><button ></button></li>`;
      },
      clickable: true
    },
    observer: true,
    loop: true,
    zoom: {
      toggle: false
    },
    setWrapperSize: false
  };
  public slides = [];
  public responsiveSlides = [];
  public sliceStart = -1;
  public sliceEnd = 2;
  public alive = true;
  public innerWidth: any;
  public nextIndex = 1;
  public activeIndex = 0;
  public toggled = 'in';

  constructor(private contentfulService: ContentfulService) {
  }
  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.contentfulService.getTestimonialsByPageId('testimonials', this.pageId).subscribe(socialSwiperSlides => {
      if (!!socialSwiperSlides) {
      for (let i = 0; i < socialSwiperSlides.length; i++) {
        const index = Math.floor(i / 2);
        if (i % 2 === 0) {
          this.slides[index] = [socialSwiperSlides[i], socialSwiperSlides[i + 1]];
        } else {
          continue;
        }
      }
      this.responsiveSlides = socialSwiperSlides;
      }
     });
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public toggle(): void {
    this.toggled = 'out';
    if (this.sliceEnd === this.slides.length) {
      this.sliceStart = -1;
      this.sliceEnd = 2;
    } else {
      this.sliceStart = this.sliceEnd - 1;
      this.sliceEnd = this.sliceEnd + 2;
    }
  }
  public toggleResponsive(): void {
    if (this.nextIndex === this.slides.length) {
      this.nextIndex = 0;
    } else {
      this.nextIndex = this.nextIndex + 1;
    }
  }

  public slideChanged(enableAutoHeight?: boolean, autoPlay?: boolean): void {
    this.socialswiperMobConfig = {
      centeredSlides: true,
      autoplay: {
        delay: 8000, // 8 seconds
        disableOnInteraction: false
      },
      speed: 1000,
      slidesPerView: 1,
      keyboard: true,
      mousewheel: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      grabCursor: true,
      pagination: {
        el: '.slider-pagination',
        renderBullet: (index, className) => {
          return `<li style="z-index: 10" class="slick-active ${className}"><button ></button></li>`;
        },
        clickable: true
      },
      observer: true,
      loop: true,
      zoom: {
        toggle: false
      },
      setWrapperSize: false
    };
    this.socialswiperRespoConfig = {
      centeredSlides: true,
      autoplay: {
        delay: 10000, // 10 seconds
        disableOnInteraction: false
      },
      speed: 1000,
      direction: 'vertical',
      slidesPerView: 1,
      keyboard: true,
      mousewheel: true,
      observer: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: '.slider-pagination',
        renderBullet: (index, className) => {
          return `<li style="z-index: 10" class="slick-active ${className}"><button ></button></li>`;
        },
        clickable: true
      },
      loop: true,
      zoom: {
        toggle: false
      },
      setWrapperSize: false,
      autoHeight: enableAutoHeight
    };
  }

  public showFullContent(data: string): void {
    this.fullContent = true;
    this.truncate(data, data.length);
    this.slideChanged(true, false);
  }

  public resetSocialSwiper($event): void {
    this.activeIndex = $event;
    if (this.innerWidth < 750) {
      if (this.activeIndex === (this.responsiveSlides.length - 1)) {
        this.nextIndex = 0;
      } else {
        this.nextIndex = this.activeIndex + 1;
      }
    }
    this.fullContent = false;
    this.slideChanged(false, true);
  }
  public truncate(data: string, limitTo: number): string {
    return data.length > limitTo ? data.substring(0, limitTo) + '...' : data;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
}
