import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserDeviceService, IUserPlan, ICatalogItem, PlacesAutocompleteService, AccountPaymentService, IAutoCompletePrediction, IFirebaseAddress } from '@ztarmobile/zwp-service-backend';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { PhoneManagementService } from 'src/services/phones.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { AppState } from 'src/app/app.service';
import { EquipmentService } from '@ztarmobile/zwp-service-backend-v2';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-check-phone-coverage',
  templateUrl: './check-phone-coverage.component.html',
  styleUrls: ['./check-phone-coverage.component.scss']
})
export class CheckPhoneCoverageComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  public activeStep = 2; // this variable is to be used in the activate event of the router-outlet
  public checkCoverageForm: UntypedFormGroup;
  public selectedPlan: IUserPlan;
  public recaptchaResponse: any;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public processingRequest = false;
  public captchaValid = false;
  public compatibleDevice;
  public selectedOption = '';
  public acceptTerms;
  public displayLimitationsForCurrent = false;
  public displayLimitationsForNew = false;
  public checkboxClicked = false;
  public selectedPlanCoveredForTmo = false;
  public yesLimitationOptionSelected = false;
  public noLimitationOptionSelected = false;
  public covered = false;
  public addressValue: string;
  public noCoverage = false;
  public isPlanFlow = false;
  public invalidAddress = false;
  public displayedAddressModel: any;
  public address: any;
  public setFoucs = false;
  public filteredOptions: Observable<Array<IAutoCompletePrediction>>;
  public filteredOptionsSubscription: Subscription;
  
  private alive = true;
  private selectedPhone: ICatalogItem;
  private isIphone = false;
  private streetSearchText: string;

  constructor(private stepsManagement: PhoneManagementService, private formBuilder: UntypedFormBuilder, private userDeviceService: UserDeviceService,
    public router: Router, private placesAutoCompleteService: PlacesAutocompleteService,
    private appState: AppState,
    private accountPaymentService: AccountPaymentService,
    private equipmentService: EquipmentService) {
    this.stepsManagement.updateCurrentStep(this.activeStep);
    this.checkCoverageForm = formBuilder.group({
      address: ['', Validators.required]
    });
    setInterval(() => {
      if (!!this.reCaptcha) {
        this.recaptchaResponse = '';
        this.reCaptcha.resetReCaptcha();
        this.reCaptcha.execute(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
      }
    }, 1.8 * 60 * 1000);
    const savedFlow = sessionStorage.getItem('planFlow');
    this.isPlanFlow = !!savedFlow ? true : false;
    this.stepsManagement.setPlanFlow(!!this.isPlanFlow ? true : false);
  }

  ngOnInit(): void {
    this.selectedPhone = JSON.parse(sessionStorage.getItem('phone'));
    this.isIphone = !!this.selectedPhone && this.selectedPhone.name.toLowerCase().indexOf('iphone') > -1
    this.stepsManagement.planFlow.pipe(takeWhile(() => this.alive)).subscribe((result) => {
      this.isPlanFlow = result;
    });
    this.stepsManagement.selectedOption.pipe(takeWhile(() => this.alive)).subscribe((option) => {
      if (!!option) {
        this.selectedOption = option;
        if (this.selectedOption !== 'new') {
          const selectedUserPlan: IUserPlan = JSON.parse(sessionStorage.getItem('selectedUserPlan'));
          if (!!selectedUserPlan) {
            if (!!selectedUserPlan.planDevice && selectedUserPlan.planDevice.network === 'tmo') {
              this.selectedPlanCoveredForTmo = true;
              this.compatibleDevice = selectedUserPlan.planDevice;
              sessionStorage.setItem('checkedDevice', JSON.stringify(this.compatibleDevice));
              sessionStorage.setItem('address', 'true');
              this.stepsManagement.setProcessValidity(true);
            } else {
              this.selectedPlanCoveredForTmo = false;
              sessionStorage.setItem('address', 'false');
              this.stepsManagement.setProcessValidity(false);
            }
          }
        }
      }
    });
    if (!this.selectedOption) {
      const selectedUserPlan: IUserPlan = JSON.parse(sessionStorage.getItem('selectedUserPlan'));
      const newUserPlan: IUserPlan = JSON.parse(sessionStorage.getItem('selectedPlanId'));
      if (!!selectedUserPlan) {
        this.stepsManagement.updateSelectedLineOption('current');
      }
      if (!!newUserPlan) {
        this.stepsManagement.updateSelectedLineOption('new');
      }
    }
  }
  ngOnDestroy(): void {
    this.alive = false;
    this.filteredOptionsSubscription?.unsubscribe();

  }
  public changedAddress(): void {
    this.noCoverage = false;
    this.findPlace(this.checkCoverageForm.controls.address.value);
    this.displayedAddressModel = null;
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public selectLimitationOption(option: string): void {
    if (option === 'yes') {
      this.yesLimitationOptionSelected = true;
      this.noLimitationOptionSelected = false;
      if (this.selectedOption === 'new') {
        // send the att sim
        this.compatibleDevice = { network: 'att', networkType: 'GSM', skuIdentifier: 'G', skuNumber: 'SIMG2G4GLTE',  verified: false };
        sessionStorage.setItem('checkedDevice', JSON.stringify(this.compatibleDevice));
        this.stepsManagement.setDeclinedTerms(false);
        if (!!this.acceptTerms && !!this.checkboxClicked) {
          sessionStorage.setItem('address', 'true');
          this.stepsManagement.setProcessValidity(true);
        } else {
          this.stepsManagement.setProcessValidity(false);
        }
      } else {
        // if the user select yes and the option was current, then remove the check from the checkbox as its related to the no option
        this.checkboxClicked = false;
        this.acceptTerms = false;
        // send the tmo sim
        this.compatibleDevice = { network: 'tmo', networkType: 'GSM', skuIdentifier: 'TE', skuNumber: 'ESIMGWLTMO4GLTE', verified: false};
        sessionStorage.setItem('checkedDevice', JSON.stringify(this.compatibleDevice));
        sessionStorage.setItem('address', 'true');
        this.stepsManagement.setDeclinedTerms(false);
        this.stepsManagement.setProcessValidity(true);
      }
    } else if (option === 'no') {
      // no option selected
      this.noLimitationOptionSelected = true;
      this.yesLimitationOptionSelected = false;
      if (this.selectedOption === 'new') {
        // if the user select no , then remove the check from the checkbox as its related to the yes option
        this.checkboxClicked = false;
        this.acceptTerms = false;
        sessionStorage.setItem('address', 'true');
        this.stepsManagement.setDeclinedTerms(true);
        this.stepsManagement.setProcessValidity(true);
      } else {
        // send the att sim for current option
        this.compatibleDevice = { network: 'att', networkType: 'GSM', skuIdentifier: 'G', skuNumber: 'SIMG2G4GLTE' ,verified: false};
        sessionStorage.setItem('checkedDevice', JSON.stringify(this.compatibleDevice));
        this.stepsManagement.setDeclinedTerms(false);
        if (!!this.acceptTerms && !!this.checkboxClicked) {
          sessionStorage.setItem('address', 'true');
          this.stepsManagement.setProcessValidity(true);
        } else {
          this.stepsManagement.setProcessValidity(false);
        }
      }


    }
  }
  public acceptTermsChanged(): void {
    this.checkboxClicked = !this.checkboxClicked;
    if (this.selectedOption === 'new') {
      this.noLimitationOptionSelected = false;
      this.yesLimitationOptionSelected = true;
      this.selectLimitationOption('yes');
    } else {
      this.noLimitationOptionSelected = true;
      this.yesLimitationOptionSelected = false;
      this.selectLimitationOption('no');
    }
  }

  public checkCoverage(): void {
    this.checkCoverageForm.markAllAsTouched();
    // the option is current and the mdn is on att and the coverage return tmo (display limitation)
    // the option is current the the mdn on att and coverage return on att (covered)
    // the option is current the the mdn on att and no coverage return (ops)
    // the option is new and the coverage is tmo (success)
    // the option is new and the coverage is att limitations
    // the option is new and no coverage ops
    if(this.displayedAddressModel){
      this.addressValue = this.checkCoverageForm.get('address').value;
      this.covered = false;
      if (this.checkCoverageForm.valid && this.recaptchaResponse) {
        this.processingRequest = true;
        this.equipmentService.checkDeviceCompatibilityByAddress(this.recaptchaResponse, this.displayedAddressModel?.postalCode,
          this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
          this.displayedAddressModel?.state, this.displayedAddressModel?.address2).then(res => {
            this.processingRequest = false;
            if (!!res) {
              this.noCoverage = false;
              this.covered = false;
              this.displayLimitationsForCurrent = false;
              this.displayLimitationsForNew = false;
              if (!!res?.att?.covered || !!res?.tmo?.covered) {
                this.compatibleDevice = {};
                this.compatibleDevice.manufacturer = res?.details?.make;
                this.compatibleDevice.marketingName = res?.details?.name;
                this.compatibleDevice.address1 = this.displayedAddressModel?.address1;
                this.compatibleDevice.address2 = this.displayedAddressModel?.address2;
                this.compatibleDevice.city = this.displayedAddressModel?.city;
                this.compatibleDevice.state = this.displayedAddressModel?.state;
                this.compatibleDevice.postalCode = this.displayedAddressModel?.postalCode;
                this.compatibleDevice.id = res?.details?.serialNumber;
                if (!!res?.tmo?.covered) {
                  this.compatibleDevice.skuIdentifier = 'TE';
                  this.compatibleDevice.skuNumber = 'ESIMGWLTMO4GLTE';
                  this.compatibleDevice.network = 'tmo';
                  if (this.selectedOption === 'new') {
                    // if the user selected new option and the returned network is tmo then its covered
                    this.setCovered();
                  } else {
                    // the user selected current mobile option
                    if (!this.selectedPlanCoveredForTmo && !!this.isIphone) {
                      // if the selected mdn is with att and the returned network on tmo then we shall display a limitation
                      this.displayLimitationsForCurrent = true;
                    } else {
                      this.setCovered();
                    }
                  }
                } else if (!!res?.att?.covered) {
                  this.compatibleDevice.skuIdentifier = res?.att?.details?.skuIdentifier;
                  this.compatibleDevice.skuNumber = res?.att?.details?.skuNumber;
                  this.compatibleDevice.network = 'att';
                  if (this.selectedOption !== 'new' && !this.selectedPlanCoveredForTmo) {
                    // if the selected option is current and the mobile network is att as well the returned network
                    this.setCovered();
                  } else {
                    // if the option is new and the phone is iphone then display limitations for new selection
                    if (!!this.isIphone) {
                      this.displayLimitationsForNew = true;
                    } else {
                      this.setCovered();
                    }
                  }
                }
                
                if (!!this.reCaptcha) {
                  this.recaptchaResponse = '';
                  this.reCaptcha.resetReCaptcha();
                  this.reCaptcha.execute();
                }
              }
            }
          }, (error) => {
            this.processingRequest = false;
            this.noCoverage = true;
            this.covered = false;
            this.displayLimitationsForCurrent = false;
            this.displayLimitationsForNew = false;
            this.stepsManagement.setProcessValidity(false);
            if (!!this.reCaptcha) {
              this.recaptchaResponse = '';
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
            }
          });
      }
      else {
        this.stepsManagement.setProcessValidity(false);
      }
    }
  }

  public addressUpdated(): void {
    this.addressValue = this.checkCoverageForm.get('address').value;
    this.covered = false;
    this.noCoverage = false;
    this.displayLimitationsForCurrent = false;
    this.displayLimitationsForNew = false;
    this.stepsManagement.setProcessValidity(false);
    this.yesLimitationOptionSelected = false;
    this.noLimitationOptionSelected = false;
    sessionStorage.removeItem('address');
  }
  public findPlace(keyword: ''): Observable<Array<IAutoCompletePrediction>> {
    this.filteredOptions = this.placesAutoCompleteService.findAddress(keyword);
    this.filteredOptionsSubscription = this.filteredOptions.subscribe();
    return this.filteredOptions;
  }
  public addressDetails(eventFire: IAutoCompletePrediction): void {
    this.noCoverage = false;
    if (!!eventFire && !!this.checkCoverageForm.controls.address?.value && this.checkCoverageForm.controls.address?.value?.main_text) {
      const event = this.checkCoverageForm.controls.address?.value;
      if (!!event.place_id) {
        this.appState.loading = true;
        this.invalidAddress = false;
        this.placesAutoCompleteService
          .findDetailedAddressFields(event.place_id)
          .subscribe(
            (place) => {
              this.streetSearchText =
                !!place.address1 && place.address1.length > 0
                  ? place.address1
                  : null;
              this.displayedAddressModel = this.getAddressValues(
                place,
                event.main_text
              );
              this.address = `${this.displayedAddressModel?.address1}, ${this.displayedAddressModel?.city
                }, ${this.displayedAddressModel?.state} ${this.displayedAddressModel?.postalCode
                  ? this.displayedAddressModel?.postalCode
                  : ''
                }`;
              this.checkCoverageForm.controls.address.setValue(this.address);
              this.appState.loading = false;
            },
            (error) => {
              this.appState.loading = false;
              console.warn(
                `Google can't find details for place: ${event.place_id}`,
                error
              );
            }
          );
      } else {
        this.invalidAddress = true;
        console.warn(`Google can't find place: ${event.main_text}`);
      }
    } else {
      this.invalidAddress = true;
    }
  }
  private getAddressValues(
    placeInfo: any,
    searchTerms?: string
  ): IFirebaseAddress {
    let address: IFirebaseAddress = {
      name: !!this.displayedAddressModel?.name
        ? this.displayedAddressModel?.name
        : this.displayedAddressModel?.alias,
      address1: placeInfo.address1,
      address2: placeInfo.address2,
      state: placeInfo.state ? placeInfo.state.toUpperCase() : placeInfo.state,
      city: placeInfo.city,
      country: placeInfo.country || 'United States',
      postalCode: placeInfo.postalCode,
    } as IFirebaseAddress;

    if (!!this.displayedAddressModel?.id) {
      address.id = this.displayedAddressModel?.id;
      address.isDefault = this.displayedAddressModel?.isDefault;
    }
    if (!!searchTerms && typeof searchTerms === 'string') {
      if (!!this.streetSearchText) {
        if (!searchTerms.match(this.streetSearchText)) {
          this.streetSearchText = null;
        }
      }
      address.address1 = !!this.streetSearchText
        ? address.address1
        : searchTerms.trim();
    }
    if (!!address && address.address1)
      address.address1 = AccountPaymentService.shortenAddress(address.address1, 30);

    // Clean Out empty values,
    address = this.appState.removeEmptyValues(address);
    return Object.assign({}, address);
  }
  private setCovered(): void {
    this.covered = true;
    this.compatibleDevice.verified = false;
    sessionStorage.setItem('checkedDevice', JSON.stringify(this.compatibleDevice));
    sessionStorage.setItem('address', 'true');
    this.stepsManagement.setProcessValidity(true);
    this.stepsManagement.setDeclinedTerms(false);
  }
}
