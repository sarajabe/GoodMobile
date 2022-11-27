import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-range-slider',
  templateUrl: './custom-range-slider.component.html',
  styleUrls: ['custom-range-slider.component.scss'],
})
export class CustomRangeSliderComponent implements OnInit {
  @Input() min = 0;
  @Input() max = 10;
  @Input() step = 1;
  @Input() id = 'custom-range-slider-id';
  @Input() customClass = '';

  @Output() value: EventEmitter<number> = new EventEmitter<number>();

  public valueModel: number = this.max;
  public rangeTicks: number[];

  ngOnInit(): any {
    this.valueModel = this.max;
    this.rangeTicks = [];
    let index = 0;
    for (let i = this.min; i <= this.max; i += this.step) {
      this.rangeTicks[index] = i;
      index++;
    }
    return this.rangeTicks;
  }

  valueChanged(event): any {
    this.value.emit(this.valueModel);
  }

  public trackValueStyle(): any {
    let marginValue = -2.5;
    let leftValue = 0;
    const trackPosPercent = (this.valueModel - this.min) / (this.max - this.min);

    if (trackPosPercent < 0) {
      leftValue = 0;
    } else if (trackPosPercent > 1) {
      leftValue = 100;
    } else {
      leftValue = 100 * trackPosPercent + marginValue;
      marginValue -= leftValue;
    }
    return {
      left: leftValue + '%',
      marginLeft: (marginValue / 10) + '%'
    };
  }

}
