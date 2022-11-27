import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-invisible-recaptcha',
  templateUrl: './invisible-recaptcha.component.html',
  styleUrls: ['./invisible-recaptcha.component.scss']
})
export class InvisibleRecaptchaComponent implements AfterViewInit, OnDestroy {

  @Input()
  @HostBinding('attr.id')
  public id = `ztarReCaptcha${nextId++}`;
  @Input() public siteKey: string;
  @Input() public size: string;
  @Input() public tabIndex: number;

  @Output() public resolved = new EventEmitter<string>();

  @ViewChild('captchaRef') captchaRef: ElementRef;

  /** @internal */
  private grecaptcha;
  /** @internal */
  private recaptchaWidgetId: number;
  /** @internal */
  private grecaptchaInterval;

  ngAfterViewInit(): void {
    this.addScriptNode();

    this.grecaptchaInterval = setInterval(() => {
      this.grecaptcha = (window as any).grecaptcha;
      if (!!this.grecaptcha && !!this.grecaptcha.render && !!this.captchaRef.nativeElement) {
        clearInterval(this.grecaptchaInterval);
        this.renderReCaptcha();
        this.grecaptcha.execute();
      }
    }, 500);

    // After 20 seconds if script not loaded then there is an issue with loading grecaptcha
    setTimeout(() => {
      if (!this.grecaptcha && !!this.grecaptchaInterval) {
        console.warn('Failed to get grecaptcha reference, make sure you can access to https://www.google.com/recaptcha/api.js');
        clearInterval(this.grecaptchaInterval);
      }
    }, 20000);
  }

  ngOnDestroy(): void {
    if (!!this.grecaptchaInterval) {
      clearInterval(this.grecaptchaInterval);
    }
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.resolved.emit(captchaResponse);
  }

  public resetReCaptcha(response?: string): void {
    (window as any).grecaptcha.reset(this.recaptchaWidgetId);
    // this.grecaptcha.execute();
    this.resolved.emit(response);
  }

  public execute(): void {
    this.grecaptcha.execute();
  }
  private addScriptNode(): void {
    if (!document.getElementById('reCaptchaScript')) {
      const node = document.createElement('script');
      node.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      node.type = 'text/javascript';
      node.async = true;
      node.defer = true;
      node.id = 'reCaptchaScript';

      document.head.appendChild(node);
    }
  }

  private renderReCaptcha(): void {
    if (this.grecaptcha) {
      this.recaptchaWidgetId = this.grecaptcha.render(this.captchaRef.nativeElement.id, {
        /* eslint-disable quote-props */
        'sitekey': this.siteKey,
        'callback': (resonse) => this.resolvedCaptcha(resonse),
        'expired-callback': (response) => this.resetReCaptcha(response),
        'size': 'invisible'
      }, true);
    } else {
      console.warn('Failed to get grecaptcha reference, make sure you can access to https://www.google.com/recaptcha/api.js');
    }
  }


}
