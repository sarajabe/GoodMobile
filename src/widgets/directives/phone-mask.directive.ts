import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';

@Directive({
    selector: '[appPhoneMask]'
})
export class PhoneMaskDirective implements OnInit, OnDestroy {

    private phoneControlAtr: AbstractControl;
    private preValueAtr: string;
    private id: string;

    @Input()
    set phoneControl(control: AbstractControl) {
        this.phoneControlAtr = control;
    }
    @Input()
    set preValue(value: string) {
        this.preValueAtr = value;
    }

    @Input()
    set inputId(value: string) {
        this.id = value;
    }

    private sub: ISubscription;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit(): void {
        this.phoneValidate();
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    phoneValidate(): void {
        this.sub = this.phoneControlAtr.valueChanges.subscribe(data => {
            const preInputValue = this.preValueAtr;
            const lastChar = preInputValue.substr(preInputValue.length - 1);
            let newVal = data.replace(/\D/g, '');
            let start = this.renderer.selectRootElement(`#${this.id}`).selectionStart;
            let end = this.renderer.selectRootElement(`#${this.id}`).selectionEnd;
            if (data.length < preInputValue.length) {
                if (preInputValue.length < start) {
                    if (lastChar === ')') {
                        newVal = newVal.substr(0, newVal.length - 1);
                    }
                }
                if (newVal.length === 0) {
                    newVal = '';
                }

                else if (newVal.length === 1) {
                    start = start + 1;
                    end = end + 1;
                }
                else if (newVal.length > 0 && newVal.length <= 3) {
                    newVal = newVal.replace(/^(\d{0,3})/, '($1)');
                } else if (newVal.length > 0 && newVal.length <= 6) {
                    newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
                } else {
                    newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
                }

                this.phoneControlAtr.setValue(newVal, { emitEvent: false });
                this.renderer.selectRootElement(`#${this.id}`).setSelectionRange(start, end);
            } else {
                const removedD = data.charAt(start);
                if (newVal.length === 0) {
                    newVal = '';
                }
                if (newVal.length === 1) {
                    start = start + 1;
                    end = end + 1;
                }
                else if (newVal.length > 0 && newVal.length <= 3) {
                    newVal = newVal.replace(/^(\d{0,3})/, '($1)');
                } else if (newVal.length > 0 && newVal.length <= 6) {
                    newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
                } else {
                    newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
                }
                if (preInputValue.length >= start) {
                    if (removedD === '(') {
                        start = start + 1;
                        end = end + 1;
                    }
                    if (removedD === ')') {
                        start = start + 2;
                        end = end + 2;
                    }
                    if (removedD === '-') {
                        start = start + 1;
                        end = end + 1;
                    }
                    if (removedD === ' ') {
                        start = start + 1;
                        end = end + 1;
                    }
                    this.phoneControlAtr.setValue(newVal, { emitEvent: false });
                    this.renderer.selectRootElement(`#${this.id}`).setSelectionRange(start, end);
                } else {
                    this.phoneControlAtr.setValue(newVal, { emitEvent: false });
                    this.renderer.selectRootElement(`#${this.id}`).setSelectionRange(start + 2, end + 2);
                }
            }
        });
    }
}
