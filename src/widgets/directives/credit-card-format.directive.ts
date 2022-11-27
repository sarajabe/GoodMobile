import { Directive, ElementRef, HostListener } from '@angular/core';
import { CreditCard } from '../validators/credit-card';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ccNumber]'
})

export class CreditCardFormatDirective {
  public target;
  private cards: Array<any>;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
    this.cards = CreditCard.cards();
  }

  @HostListener('keypress', ['$event'])
  onKeypress(e): any{
    if (CreditCard.restrictNumeric(e)) {
      if (CreditCard.isCardNumber(e.which || e.keyCode, this.target)) {
        this.formatCardNumber(e);
      }
    } else {
      e.preventDefault();
      return false;
    }

  }

  @HostListener('keydown', ['$event'])
  onKeydown(e): void {
    this.formatBackCardNumber(e);
  }

  @HostListener('keyup', ['$event'])
  onKeyup(e): void {
    this.setCardType(e);
  }

  @HostListener('input', ['$event'])
  onInput(e): void {
    this.reFormatCardNumber(e);
    this.setCardType(e);
  }

  private formatCardNumber(e): void {
    let card;
    let digit;
    let length;
    let re;
    let upperLength;
    let value;

    digit = String.fromCharCode(e.which || e.keyCode);
    if (!/^\d+$/.test(digit)) {
      return;
    }

    value = this.target.value;

    card = CreditCard.cardFromNumber(value + digit);

    length = (value.replace(/\D/g, '') + digit).length;

    upperLength = 16;

    if (card) {
      upperLength = card.length[card.length.length - 1];
    }

    if (length >= upperLength) {
      return;
    }

    if (card && card.type === 'amex') {
      re = /^(\d{4}|\d{4}\s\d{6})$/;
    } else {
      re = /(?:^|\s)(\d{4})$/;
    }

    if (re.test(value)) {
      e.preventDefault();
      setTimeout(() => {
        this.target.value = `${value} ${digit}`;
      });
    } else if (re.test(value + digit)) {
      e.preventDefault();
      setTimeout(() => {
        this.target.value = `${value}${digit} `;
      });
    }
  }

  private formatBackCardNumber(e): void{
    const value = this.target.value;
    const keyCode = e.which || e.keyCode;

    if (keyCode !== 8) {
      return;
    }

    if (/\d\s+$/.test(value)) {
      e.preventDefault();
      setTimeout(() => {
        this.target.value = value.replace(/\d\s+$/, '');
      });
    } else if (/\s\d$/.test(value)) {
      e.preventDefault();
      setTimeout(() => {
        this.target.value = value.replace(/\s\d$/, '');
      });
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      setTimeout(() => {
        this.target.value = value.replace(/\s$/, '');
      });
    }
  }

  private setCardType(e): void {
    let card;
    const val = this.target.value;
    const cardType = CreditCard.cardType(val) || 'unknown';

    if (!this.target.classList.contains(cardType)) {

      for (let i = 0, len = this.cards.length; i < len; i++) {
        card = this.cards[i];
        this.target.classList.remove(card.type);
      }

      this.target.classList.remove('unknown');
      this.target.classList.add(cardType);
      this.target.classList.toggle('identified', cardType !== 'unknown');
    }
  }

  private reFormatCardNumber(e): void {
    setTimeout(() => {
      let val = CreditCard.replaceFullWidthChars(this.target.value);
      val = CreditCard.formatCardNumber(val);
      this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(val, this.target);
    });
  }

}
