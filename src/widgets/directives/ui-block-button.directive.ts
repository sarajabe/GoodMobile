import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiBlockButton]'
})
export class UiBlockButtonDirective implements OnChanges, AfterViewInit{

  @Input() uiBlockButton: boolean;
  @Input() uiBlockMessage: string;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onDisabled: EventEmitter<boolean> = new EventEmitter();
  private oldLabel: string;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.uiBlockButton) {
      this.toggleDisable(changes.uiBlockButton.currentValue, changes.uiBlockButton.isFirstChange());
    }
  }

  ngAfterViewInit(): void {
    this.oldLabel = this.el.nativeElement.innerHTML;
  }

  private toggleDisable(disable: boolean, isFirstChange: boolean): void {
    if (!isFirstChange) {
      if (disable) {
        this.el.nativeElement.innerHTML = this.uiBlockMessage || `<span class="processing">Processing <span>.</span><span>.</span><span>.</span></span>`;
      } else {
        this.el.nativeElement.innerHTML = this.oldLabel;
      }
    }
    this.el.nativeElement.disabled = disable;
    this.onDisabled.emit(disable);
  }

}
