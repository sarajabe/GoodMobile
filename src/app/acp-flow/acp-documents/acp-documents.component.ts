import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IAcpDetails } from '@ztarmobile/zwp-service-backend-v2';
import { takeWhile } from 'rxjs/operators';
import { EbbManager } from 'src/services/ebb.service';
import Swiper, { EffectFade, Keyboard, Mousewheel, Navigation } from 'swiper';

@Component({
  selector: 'app-acp-documents',
  templateUrl: './acp-documents.component.html',
  styleUrls: ['./acp-documents.component.scss']
})
export class AcpDocumentsComponent implements OnInit, OnDestroy {
  @Input() internalData: IAcpDetails;
  @Input() disable: boolean;
  @Input() userId: string;

  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();
  @Output() setDocs: EventEmitter<any> = new EventEmitter<any>();
  
  public consent = false;
  public nextClicked = false;
  public config: any = {
    slidesPerView: 1,
    slidesPerColumn: 1,
    direction: 'horizontal',
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    centeredSlides: true,
    observer: true ,
    observeParents: true,
    speed: 1000,
    spaceBetween: 0,
    loop: false
    };
  private alive = true;
  constructor(private ebbManager: EbbManager) { }

  ngOnInit(): void {
    this.createSwiper();
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 4) {
        if (!this.consent) {
           this.nextClicked = true;
        }
        if (!!this.consent) {    
          this.goToNext.emit(5);
        }
      }
    });
  }
  public createSwiper(): void {
    const swiper = new Swiper('.swiper-container', {
      hashNavigation: true,
      lazy: true,
      preloadImages: true,
      modules: [Navigation, EffectFade, Keyboard, Mousewheel],
      ...this.config
    });
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
} 
