import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { EBB_NAME_PATTERN } from 'src/app/app.config';
import { AppState } from 'src/app/app.service';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { EbbManager } from 'src/services/ebb.service';

@Component({
  selector: 'app-signature-info',
  templateUrl: './signature-info.component.html',
  styleUrls: ['./signature-info.component.scss']
})
export class SignatureInfoComponent implements OnInit, OnDestroy, OnChanges {
  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();
  @Input() appId: string;
  @Input() fName: string;
  @Input() lName: string;
  @Input() signed: boolean;
  @Input() disable: boolean;
  @Output() setSignature: EventEmitter<any> = new EventEmitter<any>();
  public signatureForm: FormGroup;
  public fullName: string;
  public firstCharFName: string;
  public firstCharLName: string;
  public firstChars: string;
  public recaptchaResponse: string;
  public captchaValid: boolean;
  public SITE_ID = CAPTCHA_SITE_ID;
  public showCaptchaError = false;
  private alive = true;

  constructor(private formBuilder: FormBuilder, private ebbManager: EbbManager,
    private appState: AppState) {
  }

  ngOnInit(): void {
    if (!!this.fName && !!this.lName) {
      this.fullName = `${this.fName} ${this.lName}`;
      this.firstCharFName = this.fName.substr(0, 1).toUpperCase();
      this.firstCharLName = this.lName.substr(0, 1).toUpperCase();
      this.firstChars = `${this.firstCharFName}${this.firstCharLName}`;
    }
    this.signatureForm = this.formBuilder.group({
      firstCheck: ['', Validators.compose([Validators.required, Validators.pattern(this.firstChars), Validators.maxLength(2)])],
      secondCheck: ['', Validators.compose([Validators.required, Validators.pattern(this.firstChars), Validators.maxLength(2)])],
      thirdCheck: ['', Validators.compose([Validators.required, Validators.pattern(this.firstChars), Validators.maxLength(2)])],
      forthCheck: ['', Validators.compose([Validators.required, Validators.pattern(this.firstChars), Validators.maxLength(2)])],
      name: ['', Validators.compose([Validators.required, Validators.pattern(EBB_NAME_PATTERN)])],
    }, { validator: this.matchingFullName(this.fullName, 'name') });

    if (!!this.signed) {
      this.signatureForm.controls.firstCheck.setValue(this.firstChars);
      this.signatureForm.controls.secondCheck.setValue(this.firstChars);
      this.signatureForm.controls.thirdCheck.setValue(this.firstChars);
      this.signatureForm.controls.forthCheck.setValue(this.firstChars);
      this.signatureForm.controls.firstCheck.disable({ onlySelf: true });
      this.signatureForm.controls.secondCheck.disable({ onlySelf: true });
      this.signatureForm.controls.thirdCheck.disable({ onlySelf: true });
      this.signatureForm.controls.forthCheck.disable({ onlySelf: true });
      this.signatureForm.controls.name.disable({ onlySelf: true });
    }
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      this.ebbManager.acpFlowSelected.pipe(takeWhile(() => this.alive)).subscribe((res) => {
        const flow = res;
        if (!!step && ((!this.appId && (step === 5 && flow === 'no') || (step === 4 && flow === 'yes-without-id')) || (!!this.appId && step === 3))) {
          this.signatureForm.markAllAsTouched();
          this.showCaptchaError = !!this.recaptchaResponse ? false : true;
          if (!!this.signatureForm.valid && !!this.fullName && !!this.captchaValid) {
            this.appState.loading = true;
            const data: any = {
              initials: this.signatureForm.controls.firstCheck.value,
              fullName: this.fullName,
              firstName: this.fName,
              lastName: this.lName,
              captcha: this.recaptchaResponse
            };
            this.setSignature.emit(data);
          }
        }
      });
    });
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
    this.showCaptchaError = false;
  }

  public matchingFullName(fullNameKey: string, enteredNameKey: string): any {
    return (group: FormGroup): { [key: string]: any } => {
      const enteredName = group.controls[enteredNameKey];
      if (fullNameKey.toUpperCase() !== enteredName.value.toUpperCase()) {
        return {
          mismatchedFullName: true
        };
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.signed) {
      this.signed = changes.signed.currentValue;
    }
    if (!!changes.disable) {
      this.disable = changes.disable.currentValue;
      if (!!this.disable) {
        this.signatureForm.disable();
      }
    }
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
}
