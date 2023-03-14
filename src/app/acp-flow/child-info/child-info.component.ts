import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { takeWhile } from "rxjs/operators";
import { EbbService, IAcpDetails, IAcpUser } from "@ztarmobile/zwp-service-backend-v2";
import { ALPHANUMERIC_PATTERN, EBB_NAME_PATTERN, NUMBERS_ONLY_PATTERN } from "src/app/app.config";
import { EbbManager } from "src/services/ebb.service";
import { ToastrHelperService } from "src/services/toast-helper.service";
import { AppState } from "src/app/app.service";
import { ActionsAnalyticsService } from "@ztarmobile/zwp-service-backend";
import { IDropdownSettings } from "ng-multiselect-dropdown";

@Component({
  selector: "app-child-info",
  templateUrl: "./child-info.component.html",
  styleUrls: ["./child-info.component.scss"],
})
export class ChildInfoComponent implements OnInit, OnChanges {
  @Input() trackingSubscription: Observable<number>;
  @Input() userInfo: IAcpUser;
  @Input() eligableCode: string;
  @Input() schoolName: string;
  @Input() publicHousingCode: string;
  @Input() userId: string;
  @Input() disable: boolean;
  @Input() internalData: IAcpDetails;
  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();
  @Output() setChildInfo: EventEmitter<{
    code: string;
    user?: IAcpUser;
    schoolName?: string;
    publicHousingCode?: string;
  }> = new EventEmitter<{
    user: IAcpUser;
    code: string;
    schoolName?: string;
    publicHousingCode?: string;
  }>();

  public qualifyingForm: UntypedFormGroup;
  public options = [
    { id: 'indivisual', value: 'I qualify as an individual' },
    { id: 'child', value: 'I qualify through my child or dependent' }
  ];
  public housingOptions = [];

  public childInfoForm: UntypedFormGroup;
  public codesForm: UntypedFormGroup;
  public dropdownSettings: IDropdownSettings;
  public selectedItems: Array<{ code: string; description: string }> = [];
  public selectedCodes: Array<string> = [];
  public eligibilityCodes: Array<{ code: string; description: string }>;
  public namePattern = new RegExp(EBB_NAME_PATTERN);
  public showInvalidDateError = false;
  public years = [];

  private state: string;
  private validateChild = false;
  private alive = true;
  leapYear: boolean;

  constructor(private formBuilder: UntypedFormBuilder,
    private ebbManager: EbbManager,
    private ebbService: EbbService,
    private toastHelper: ToastrHelperService,
    private appState: AppState,
    private analyticsService: ActionsAnalyticsService
  ) {
    this.getYearsValues();
    this.qualifyingForm = new UntypedFormGroup({
      option: new UntypedFormControl('', Validators.required)
    });
    this.childInfoForm = this.formBuilder.group({
      firstName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(this.namePattern),
          Validators.minLength(1),
          Validators.maxLength(50),
        ]),
      ],
      middleName: [
        "",
        Validators.compose([
          Validators.pattern(this.namePattern),
          Validators.minLength(1),
          Validators.maxLength(50),
        ]),
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(this.namePattern),
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
      ],
      day: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(NUMBERS_ONLY_PATTERN),
          Validators.maxLength(2),
          Validators.min(1),
          Validators.max(31),
        ]),
      ],
      month: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(NUMBERS_ONLY_PATTERN),
        ]),
      ],
      year: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(NUMBERS_ONLY_PATTERN)
        ]),
      ],
      identityType: ["", Validators.required],
      ssn: [
        "",
        Validators.compose([
          Validators.pattern(NUMBERS_ONLY_PATTERN),
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),
      ],
      tribalId: [
        "",
        Validators.compose([Validators.minLength(2), Validators.maxLength(20)]),
      ],
    });
    this.codesForm = this.formBuilder.group({
      eligibilityCode: ["", Validators.required],
      selectedItems: ["", Validators.required],
      housingAssistance: [""],
      schoolName: [
        "",
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(ALPHANUMERIC_PATTERN),
        ]),
      ],
    });
  }

  ngOnInit(): void {
    this.trackEvent();
    this.appState.loading = true;
    if(!!this.internalData && Object.keys(this.internalData).length > 0 && !!this.internalData?.user?.address?.primary?.state) {
     this.state = this.internalData?.user?.address?.primary?.state;
    }
    this.ebbService.getCodes(this.state).then(
      (data) => {
        this.appState.loading = false;
        if (!!data) {
          this.ebbService.getPublicHousingPrograms().then(res => {
            if (!!res?.housingPrograms) {
              res?.housingPrograms.map((item) => {
                this.housingOptions.push({ id: item?.code, value: item?.description });
              })
            }
          }, (error) => {
            this.toastHelper.showAlert(error.message);
          })
          this.eligibilityCodes = data.eligibilityCodes;
          if (!!this.eligableCode && !!this.eligibilityCodes) {
            const codes = this.eligableCode.split(",");
            if (!!codes) {
              codes.map((code) => {
                this.eligibilityCodes.map((item) => {
                  if (item.code === code) {
                    this.selectedItems.push(item);
                    this.selectedCodes.push(code);
                    if(!!code && code === "E4" && !this.codesForm.controls.housingAssistance.value) {
                      this.codesForm.controls.housingAssistance.setValidators([
                        Validators.compose([ Validators.required ])]);
                      this.codesForm.controls.housingAssistance.updateValueAndValidity();
                    } 
                  }
                });
              });
            }
            this.codesForm.controls.eligibilityCode.setValue(this.eligableCode);
            this.codesForm.controls.selectedItems.setValue(this.selectedItems);
          }
        }
      },
      (error) => {
        this.appState.loading = false;
        this.toastHelper.showAlert(error.message);
      }
    );
    this.dropdownSettings = {
      singleSelection: false,
      idField: "code",
      textField: "description",
      enableCheckAll: false,
      allowSearchFilter: false,
    };
    this.ebbManager.activeStep
      .pipe(takeWhile(() => this.alive))
      .subscribe((step) => {
        if (!!step && step === 3) {
          this.codesForm.markAllAsTouched();
          this.qualifyingForm.markAllAsTouched();
          this.validateChild = this.qualifyingForm.controls.option.value === 'child' ?  true : false;
          if (!!this.validateChild) {
            this.childInfoForm.markAllAsTouched();
          }
          if (((!!this.qualifyingForm.valid && !!this.validateChild && !!this.childInfoForm.valid && !this.showInvalidDateError) || (!!this.qualifyingForm.valid && !this.validateChild)) && this.codesForm.valid) {
            if (!!this.validateChild) {
              this.prepareUserData();
            }
            this.setChildInfo.emit({
              code: this.codesForm.controls.eligibilityCode.value,
              schoolName: this.codesForm.controls.schoolName.value,
              publicHousingCode: this.codesForm.controls.housingAssistance.value,
              user: !!this.validateChild ? this.userInfo : null,
            });
            this.goToNext.emit(4);
          }
        }
      });
    if (!!this.schoolName) {
      this.codesForm.controls.schoolName.setValue(this.schoolName);
    }
    if(!!this.publicHousingCode) {
      this.codesForm.controls.housingAssistance.setValue(this.publicHousingCode);
    }
    if (!!this.internalData && Object.keys(this.internalData).length > 0 && !!this.internalData?.eligibilityCode) {
      if (!!this.userInfo && Object.keys(this.userInfo).length !== 0) {
        this.validateChild = true;
        this.qualifyingForm.controls.option.setValue('child');
        this.populateForm();
      } else {
        this.qualifyingForm.controls.option.setValue('indivisual');
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.disable) {
      this.disable = changes.disable.currentValue;
      if (!!this.disable) {
        this.codesForm.disable();
        this.childInfoForm.disable();
      }
    }
  }

  public checkMonth(): void {
    let date = new Date();
    let todaysDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    if (
      this.childInfoForm.controls.month.value &&
      this.childInfoForm.controls.year.value &&
      this.childInfoForm.controls.day.value
    ) {
      let selectedDate = new Date(
        parseInt(this.childInfoForm.controls.year.value),
        parseInt(this.childInfoForm.controls.month.value) - 1,
        parseInt(this.childInfoForm.controls.day.value)
      );
      const year = this.childInfoForm.controls.year.value;
      this.leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) ? true : false
      if (selectedDate.getTime() > todaysDate.getTime() || (!this.leapYear && this.childInfoForm.controls.day.value === '29' && this.childInfoForm.controls.month.value === '02') || ((this.childInfoForm.controls.day.value === '30' || this.childInfoForm.controls.day.value === '31') && this.childInfoForm.controls.month.value === '02')) {
        this.showInvalidDateError = true;
      } else {
        this.showInvalidDateError = false;
      }
    }
  }

  public onItemSelect(item: any): void {
    if (!!item.code) {
      if (!this.selectedCodes.some((codes) => codes === item.code)) {
        this.selectedCodes.push(item.code);
      }
      this.codesForm.controls.eligibilityCode.setValue(
        this.selectedCodes.toString()
      );
      const selectedValue = this.codesForm.controls.eligibilityCode.value;
      if (!!selectedValue && (selectedValue.includes("E50") || selectedValue.includes("E51"))) {
        this.codesForm.controls.schoolName.setValidators([
          Validators.compose([
            Validators.required,
            Validators.pattern(ALPHANUMERIC_PATTERN),
            Validators.maxLength(50),
          ]),
        ]);
        this.codesForm.controls.schoolName.updateValueAndValidity();
      } else {
        this.codesForm.controls.schoolName.reset();
        this.codesForm.controls.schoolName.clearValidators();
        this.codesForm.controls.schoolName.updateValueAndValidity();
      }
      if(!!selectedValue && selectedValue.includes("E4")) {
        this.codesForm.controls.housingAssistance.setValidators([
          Validators.compose([ Validators.required ])]);
        this.codesForm.controls.housingAssistance.updateValueAndValidity();
      } else {
        this.codesForm.controls.housingAssistance.reset();
        this.codesForm.controls.housingAssistance.clearValidators();
        this.codesForm.controls.housingAssistance.updateValueAndValidity();
      }
    }
  }
  public onItemDeSelect(item: any): void {
    if (!!item.code && this.selectedCodes.includes(item.code)) {
      const unselectedItemIndex = this.selectedCodes.findIndex(
        (elm) => item.code === elm
      );
      if (unselectedItemIndex > -1) {
        this.selectedCodes.splice(unselectedItemIndex, 1);
        this.codesForm.controls.eligibilityCode.setValue(
          this.selectedCodes.toString()
        );
      }
      if (item.code.includes("E50") || item.code.includes("E51")) {
        this.codesForm.controls.schoolName.reset();
        this.codesForm.controls.schoolName.clearValidators();
        this.codesForm.controls.schoolName.updateValueAndValidity();
      }
      if (item.code.includes("E4")) {
        this.codesForm.controls.housingAssistance.reset();
        this.codesForm.controls.housingAssistance.clearValidators();
        this.codesForm.controls.housingAssistance.updateValueAndValidity();
      }
    }
  }

  public updateIdentitiyType(): void {
    const selectedValue = this.childInfoForm.controls.identityType.value;
    if (selectedValue === "ssn") {
      this.childInfoForm.controls.ssn.setValidators([
        Validators.compose([
          Validators.required,
          Validators.pattern(NUMBERS_ONLY_PATTERN),
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),
      ]);
      this.childInfoForm.controls.ssn.updateValueAndValidity();
      this.childInfoForm.controls.tribalId.clearValidators();
      this.childInfoForm.controls.tribalId.updateValueAndValidity();
    }
    if (selectedValue === "tribal") {
      this.childInfoForm.controls.tribalId.setValidators([
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
      ]);
      this.childInfoForm.controls.tribalId.updateValueAndValidity();
      this.childInfoForm.controls.ssn.clearValidators();
      this.childInfoForm.controls.ssn.updateValueAndValidity();
    }
  }

  private getYearsValues(): void {
    const today = new Date();
    const currentYear = today.getFullYear();
    for (let i = 1892; i <= currentYear; i++) {
      this.years.push(i);
    }
  }
  private prepareUserData(): void {
    this.userInfo = {} as IAcpUser;
    const dayFormat = this.childInfoForm.controls.day.value;
    this.userInfo.firstName = this.childInfoForm.controls.firstName.value;
    this.userInfo.middleName = !!this.childInfoForm.controls.middleName.value
      ? this.childInfoForm.controls.middleName.value
      : undefined;
    this.userInfo.lastName = this.childInfoForm.controls.lastName.value;
    this.userInfo.identityVerification =
      this.childInfoForm.controls.identityType.value;
    this.userInfo.last4ssn = !!this.childInfoForm.controls.ssn.value
      ? this.childInfoForm.controls.ssn.value
      : undefined;
    this.userInfo.tribalId = !!this.childInfoForm.controls.tribalId.value
      ? this.childInfoForm.controls.tribalId.value
      : undefined;
    this.userInfo.dob =
      this.childInfoForm.controls.month.value +
      "/" +
      dayFormat +
      "/" +
      this.childInfoForm.controls.year.value;
  }

  private populateForm(): void {
    this.childInfoForm.controls.firstName.setValue(this.userInfo.firstName);
    this.childInfoForm.controls.middleName.setValue(this.userInfo.middleName);
    this.childInfoForm.controls.lastName.setValue(this.userInfo.lastName);
    this.childInfoForm.controls.identityType.setValue(
      this.userInfo.identityVerification
    );
    this.childInfoForm.controls.ssn.setValue(this.userInfo.last4ssn);
    this.childInfoForm.controls.tribalId.setValue(this.userInfo.tribalId);
    this.childInfoForm.controls.day.setValue(this.userInfo.dob.split("/")[1]);
    this.childInfoForm.controls.month.setValue(this.userInfo.dob.split("/")[0]);
    this.childInfoForm.controls.year.setValue(this.userInfo.dob.split("/")[2]);
  }

  private trackEvent(): void {
    const data = {
      event: "qualified_prog",
      category: "ACP",
      label: "ACP Step 2",
      action: "verify qualified program",
    };
    this.analyticsService.trackACPEvent(data);
  }
}
