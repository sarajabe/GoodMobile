import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EbbService, ISignAcpDetails } from '@ztarmobile/zwp-service-backend-v2';
import { takeWhile } from 'rxjs/operators';
import { EBB_NAME_PATTERN } from 'src/app/app.config';
import { AppState } from 'src/app/app.service';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { EbbManager } from 'src/services/ebb.service';

@Component({
  selector: 'app-notice-agreement',
  templateUrl: './notice-agreement.component.html',
  styleUrls: ['./notice-agreement.component.scss']
})
export class NoticeAgreementComponent implements OnInit, OnDestroy, OnChanges {
  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();
  @Input() fName: string;
  @Input() lName: string;
  @Input() signed: boolean;
  @Input() disable: boolean;
  @Output() setSignature: EventEmitter<any> = new EventEmitter<any>();
  public SITE_ID = CAPTCHA_SITE_ID;
  public signForm: UntypedFormGroup;
  public fullName: string;
  public firstCharFName: string;
  public firstCharLName: string;
  public firstChars: string;
  public showCaptchaError = false;
  public recaptchaResponse: string;
  public captchaValid: boolean;
  private alive = true;

  constructor(private formBuilder: FormBuilder, private ebbManager: EbbManager, private ebbService: EbbService,
    private appState: AppState) {
  }

  ngOnInit(): void {
    this.fullName = `${this.fName} ${this.lName}`;
    this.firstCharFName = this.fName.substr(0, 1).toUpperCase();
    this.firstCharLName = this.lName.substr(0, 1).toUpperCase();
    this.firstChars = `${this.firstCharFName}${this.firstCharLName}`;
    this.signForm = this.formBuilder.group({
      firstCheck: ['', Validators.compose([Validators.required, Validators.pattern(this.firstChars), Validators.maxLength(2)])],
      secondCheck: ['', Validators.compose([Validators.required, Validators.pattern(this.firstChars), Validators.maxLength(2)])],
      thirdCheck: ['', Validators.compose([Validators.required, Validators.pattern(this.firstChars), Validators.maxLength(2)])],
      forthCheck: ['', Validators.compose([Validators.required, Validators.pattern(this.firstChars), Validators.maxLength(2)])],
      name: ['', Validators.compose([Validators.required, Validators.pattern(EBB_NAME_PATTERN)])],
    }, { validator: this.matchingFullName(this.fullName, 'name') });
    if (!!this.signed) {
      this.signForm.controls.firstCheck.setValue(this.firstChars);
      this.signForm.controls.secondCheck.setValue(this.firstChars);
      this.signForm.controls.thirdCheck.setValue(this.firstChars);
      this.signForm.controls.forthCheck.setValue(this.firstChars);
      this.signForm.controls.firstCheck.disable({ onlySelf: true });
      this.signForm.controls.secondCheck.disable({ onlySelf: true });
      this.signForm.controls.thirdCheck.disable({ onlySelf: true });
      this.signForm.controls.forthCheck.disable({ onlySelf: true });
      this.signForm.controls.name.disable({ onlySelf: true });
    }
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 4) {
        this.signForm.markAllAsTouched();
        this.showCaptchaError = !!this.recaptchaResponse ? false : true;
        if (!!this.signForm.valid && !!this.fullName && !!this.captchaValid) {
          if (!this.signed) {
            this.appState.loading = true;
            const data: any = {
              initials: this.signForm.controls.firstCheck.value,
              fullName: this.fullName,
              firstName: this.fName,
              lastName: this.lName,
              signatureDate: new Date().toISOString(),
              captcha: this.recaptchaResponse
            };
            this.setSignature.emit(data);
          } else {
            this.goToNext.emit(5);
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
    this.showCaptchaError = false;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.signed) {
      this.signed = changes.signed.currentValue;
    }
    if (!!changes.disable) {
      this.disable = changes.disable.currentValue;
      if (!!this.disable) {
        this.signForm.disable();
      }
    }
  }

  private matchingFullName(fullNameKey: string, enteredNameKey: string): any {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      const enteredName = group.controls[enteredNameKey];

      if (fullNameKey.toUpperCase() !== enteredName.value.toUpperCase()) {
        return {
          mismatchedFullName: true
        };
      }
    };
  }
}
