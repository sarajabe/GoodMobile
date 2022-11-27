import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { PlatformLocation } from '@angular/common';

export class MigrationModalContext extends BSModalContext {
  public customClass?: string;
}

@Component({
  selector: 'app-migration-steps',
  templateUrl: './migration-steps.component.html'
})
export class MigrationStepsComponent implements CloseGuard, ModalComponent<MigrationModalContext> {
  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 60,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      hideOnClick: false
    }
  };
  public context: MigrationModalContext;
  public index = 0;
  constructor(public dialog: DialogRef<MigrationModalContext>, private location: PlatformLocation) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
  }
  public slideChanged(): void {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 60,
      direction: 'horizontal',
      scrollbar: false,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      centeredSlides: true,
      observer: true,
      speed: 1000,
      roundLengths: true,
      autoplay: {
        delay: 8000, // 8 seconds
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
    };
  }
  public showNextStep(): void {
    this.index = this.index + 1;
  }
  public startMigration(result): void{
    this.dialog.close(result);
  }
  beforeClose(): boolean {
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
    }
    return false;
  }

  beforeDismiss(): boolean {
    return this.beforeClose();
  }

 closeDialog(): void {
    this.dialog.dismiss();
  }
}
