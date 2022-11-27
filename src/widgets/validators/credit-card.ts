// http://www.regular-expressions.info/creditcard.html
// @dynamic
export class CardFormats {
    /* eslint-disable */
    public static defaultFormat() { return /(\d{1,4})/g; }
    public static amexFormat() { return /(\d{1,4})(\d{1,6})?(\d{1,5})?/; }
    public static dcFormat() { return /(\d{1,4})(\d{1,6})?(\d{1,4})?/; }
  }

export const cards = [
    {
      type: 'maestro',
      patterns: [5018, 502, 503, 506, 56, 58, 639, 6220, 67],
      format: CardFormats.defaultFormat(),
      length: [12, 13, 14, 15, 16, 17, 18, 19],
      cvvLength: [3],
      luhn: true
    }, {
      type: 'forbrugsforeningen',
      patterns: [600],
      format: CardFormats.defaultFormat(),
      length: [16],
      cvvLength: [3],
      luhn: true
    }, {
      type: 'dankort',
      patterns: [5019],
      format: CardFormats.defaultFormat(),
      length: [16],
      cvvLength: [3],
      luhn: true
    }, {
      type: 'visa',
      patterns: [4],
      format: CardFormats.defaultFormat(),
      length: [13, 16],
      cvvLength: [3],
      luhn: true
    }, {
      type: 'mastercard',
      patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
      format: CardFormats.defaultFormat(),
      length: [16],
      cvvLength: [3],
      luhn: true
    }, {
      type: 'amex',
      patterns: [34, 37],
      format: CardFormats.amexFormat(),
      length: [15],
      cvvLength: [3, 4],
      luhn: true
    }, {
      type: 'dinersclub',
      patterns: [30, 36, 38, 39],
      format: CardFormats.dcFormat(),
      length: [14],
      cvvLength: [3],
      luhn: true
    }, {
      type: 'discover',
      patterns: [60, 64, 65, 622],
      format: CardFormats.defaultFormat(),
      length: [16],
      cvvLength: [3],
      luhn: true
    }, {
      type: 'unionpay',
      patterns: [62, 88],
      format: CardFormats.defaultFormat(),
      length: [16, 17, 18, 19],
      cvvLength: [3],
      luhn: false
    }, {
      type: 'jcb',
      patterns: [35],
      format: CardFormats.defaultFormat(),
      length: [16],
      cvvLength: [3],
      luhn: true
    }
  ];

export class CreditCard {
    public static cards() {
      return cards;
    }

    public static cardFromNumber(num) {
      /* eslint-disable one-var */
      let card, p, pattern, ref;
      num = (num + '').replace(/\D/g, '');
      for (let i = 0, len = cards.length; i < len; i++) {
        card = cards[i];
        ref = card.patterns;
        for (let j = 0, len1 = ref.length; j < len1; j++) {
          pattern = ref[j];
          p = pattern + '';
          if (num.substr(0, p.length) === p) {
            return card;
          }
        }
      }
    }

    public static restrictNumeric(e): boolean {
      const keyCode = e.which || e.keyCode || e.key;
      // 9 = tab
      if (e.metaKey || keyCode === 9) {
        return true;
      }
      if (keyCode < 32) { //
        return true;
      }
      return /[\d\s]/.test(String.fromCharCode(keyCode));
    }

    public static hasTextSelected(target) {
      return target.selectionStart !== null && target.selectionStart !== target.selectionEnd;
    }

    public static cardType(num) {
      if (!num) {
        return num;
      }
      const card = this.cardFromNumber(num);
      if (card !== null && typeof card !== 'undefined') {
        return card.type;
      } else {
        return null;
      }
    }

    public static formatCardNumber(num) {
      let card, groups, upperLength;
      num = num.replace(/\D/g, '');
      card = this.cardFromNumber(num);
      if (!card) {
        return num;
      }
      upperLength = card.length[card.length.length - 1];
      num = num.slice(0, upperLength);
      if (card.format.global) {
        const matches = num.match(card.format);
        if (matches != null) {
          return matches.join(' ');
        }
      } else {
        groups = card.format.exec(num);
        if (groups == null) {
          return;
        }
        groups.shift();
        delete(groups.index);
        delete(groups.input);
        return groups.join(' ');
      }
    }

    public static safeVal(value, target) {
      let cursor = null, result: any = false;
      const last = target.value;
      try {
        cursor = target.selectionStart;
      } catch (error) {
        // ignored
      }
      target.value = value;
      if (cursor !== null && target === document.activeElement) {
        if (cursor === last.length) {
          cursor = value.length;
        }
        if (last !== value) {
          const prevPair = last.slice(cursor - 1, +cursor + 1 || 9e9),
            currPair = value.slice(cursor - 1, +cursor + 1 || 9e9),
            digit = value[cursor];
          if (/\d/.test(digit) && prevPair === (`${digit} `) && currPair === (` ${digit}`)) {
            cursor = cursor + 1;
          }
        }
        result = cursor;
      }
      return result;
    }

    public static isCardNumber(key, target) {
      let card, digit, value, result;
      digit = String.fromCharCode(key);
      if (!/^\d+$/.test(digit)) {
        return false;
      }
      if (CreditCard.hasTextSelected(target)) {
        return true;
      }
      value = (target.value + digit).replace(/\D/g, '');
      card = CreditCard.cardFromNumber(value);
      if (card) {
        result = value.length <= card.length[card.length.length - 1];
      } else {
        result = value.length <= 16;
      }
      return result;
    }

    public static restrictExpiry(key, target) {
      let digit,
        value;
      digit = String.fromCharCode(key);
      if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
        return false;
      }
      value = `${target.value}${digit}`.replace(/\D/g, '');
      return value.length > 6;
    }

    public static replaceFullWidthChars(str) {
      if (str === null) {
        str = '';
      }
      str = str.replace(' ', '');
      let chr, idx, value = '';
      const fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19';
      const halfWidth = '0123456789';
      const chars = str.split('');
      for (const char of chars) {
        chr = char;
        idx = fullWidth.indexOf(chr);
        if (idx > -1) {
          chr = halfWidth[idx];
        }
        value += chr;
      }
      return value;
    }

    public static formatExpiry(expiry) {
      const parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);
      let mon,
        sep,
        year;
      if (!parts) {
        return '';
      }
      mon = parts[1] || '';
      sep = parts[2] || '';
      year = parts[3] || '';
      if (year.length > 0) {
        sep = ' / ';
      } else if (sep === ' /') {
        mon = mon.substring(0, 1);
        sep = '';
      } else if (mon.length === 2 || sep.length > 0) {
        sep = ' / ';
      } else if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
        mon = `0${mon}`;
        sep = ' / ';
      }
      return `${mon}${sep}${year}`;
    }

    public static restrictCvc(key, target) {
      const digit = String.fromCharCode(key);
      if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
        return false;
      }
      const val = `${target.value}${digit}`;
      return val.length <= 4;
    }

    public static luhnCheck(num) {
      let digit,
        odd = true,
        sum = 0;
      const digits = num.split('').reverse();
      for (const dig of digits) {
        digit = dig;
        digit = parseInt(digit, 10);
        odd = !odd;
        if (odd) {
          digit *= 2;
        }
        if (digit > 9) {
          digit -= 9;
        }
        sum += digit;
      }
      return sum % 10 === 0;
    }
}
