import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EbbService, IAcpDetails } from '@ztarmobile/zwp-service-backend-v2';
import { takeWhile } from 'rxjs/operators';
import { AppState } from 'src/app/app.service';
import { EbbManager } from 'src/services/ebb.service';
import Swiper, { EffectFade, Keyboard, Mousewheel, Navigation } from 'swiper';

@Component({
  selector: 'app-acp-documents',
  templateUrl: './acp-documents.component.html',
  styleUrls: ['./acp-documents.component.scss']
})
export class AcpDocumentsComponent implements OnInit, OnDestroy {
  @Input() internalData: IAcpDetails;
  @Input() disable: boolean;
  @Input() userId: string;

  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();
  @Output() setDocs: EventEmitter<any> = new EventEmitter<any>();

  public consent = false;
  public nextClicked = false;
  public doSplit = false;
  public incomeDesc;
  public config: any = {
    slidesPerView: 1,
    direction: 'horizontal',
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    centeredSlides: true,
    observer: true,
    observeParents: true,
    speed: 1000,
    spaceBetween: 0,
    loop: false
  };
  public eligibilityCodes: Array<{ code: string; description: string }>;
  public selectedCodes;
  public selectedCodesDescs = [];
  public docsCategories = [];
  public docDetails: Array<{ closeTab:boolean, consent: boolean, category: string; proofs: Array<any>; slides: Array<any>, text: Array<any> }> = [];
  private alive = true;
  constructor(private ebbManager: EbbManager, private ebbService: EbbService, private appState: AppState,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cd.detectChanges();
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 4) {
        this.consent = this.docDetails.every(item => item.consent);
        if (!this.consent) {
          this.nextClicked = true;
          const filteredArray = this.docDetails.filter(doc => doc.consent !== true);
          filteredArray.map(item => item.closeTab = false);
        }
        if (!!this.consent) {
          this.goToNext.emit(5);
        }
      }
    });
    if (!!this.internalData && !!this.internalData.eligibilityCode) {
      const state = this.internalData.user?.address?.primary?.state;
      this.appState.loading = true;
      this.ebbService.getCodes(state).then(res => {
        this.appState.loading = false;
        if (!!res) {
          this.eligibilityCodes = res?.eligibilityCodes;
          this.selectedCodes = this.internalData?.eligibilityCode?.split(",");
          if (!!this.selectedCodes) {
            this.selectedCodes.map((code) => {
              this.eligibilityCodes.map((item) => {
                if (item.code === code) {
                  if((this.selectedCodesDescs.length > 1 ||  this.selectedCodesDescs.length === 1 )&& code === 'E13') {
                      this.doSplit = true;
                      this.incomeDesc = item?.description;
                  }
                  else {
                    this.selectedCodesDescs.push(item?.description);
                  }
                }
              });
            });
            this.checkDocGroups(this.selectedCodes);
            this.cd.detectChanges();
          }

        }
      }, error => {
        this.appState.loading = false;
      })
    }
  }
  public createSwiper(): void {
    const swiper = new Swiper('.swiper-container', {
      hashNavigation: true,
      lazy: true,
      preloadImages: true,
      modules: [Navigation, EffectFade, Keyboard, Mousewheel],
      ...this.config
    });
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public expandImg(docIndex, slideIndex, asset): void {
    Object.assign(this.docDetails[docIndex].slides[slideIndex], {expand: true, expandAsset: `expand-${asset}`});
    this.cd.detectChanges();
  }
  private checkDocGroups(selectedCodes): void {
    const commonCondition = selectedCodes.includes('E54') || selectedCodes.includes('E3') || selectedCodes.includes('E4') || selectedCodes.includes('E15') || selectedCodes.includes('E8')
      || selectedCodes.includes('E9') || selectedCodes.includes('E10');
    // check the generic group
    if (commonCondition) {
      if (selectedCodes.includes('E1') || selectedCodes.includes('E2')) {
        this.docsCategories.push('Generic Group');
      } else {
        this.docsCategories.push('Generic Group');
      }
    } //another case for generic
    if (!commonCondition && selectedCodes.includes('E1') && selectedCodes.includes('E2')) {
      this.docsCategories.push('Generic Group');
    } // check SNAP group
    if (!commonCondition && selectedCodes.includes('E2') && !selectedCodes.includes('E1')) {
      this.docsCategories.push('SNAP');
    } // check Medicaid group
    if (!commonCondition && selectedCodes.includes('E1') && !selectedCodes.includes('E2')) {
      this.docsCategories.push('Medicaid');
    } // check pell grant group
    if (selectedCodes.includes('E51') || selectedCodes.includes('E50')) {
      this.docsCategories.push('Pell Grant');
    } // check income group
    if (selectedCodes.includes('E13')) {
      this.docsCategories.push('Through income');
    }
    this.cd.detectChanges();
    this.checkProofs();
  }
  private checkProofs(): void {
    if (this.docsCategories?.length > 0) {
      this.docsCategories.map(cat => {
        if (cat === 'Generic Group') {
          const proofs = [
            'Your Name, or your Dependent’s Name ',
            'The name of the Qualifying Program ',
            'The name of the Government or Tribal Agency that issued the document ',
            'An issue date within the last 12 months or a future expiration date'
          ];
          const slides = [{ asset: 'snap-geniric.png', title: 'Approval or Benefit Letter:' }];
          const text = ['Screenshot of Online Portal', 'Survivors Benefit Summary Letter'];
          this.docDetails.push({ closeTab:false, consent: false, category: cat, proofs, slides, text });
        }
        if (cat === 'SNAP') {
          const proofs = [
            'Your Name, or your Dependent’s Name ',
            'The name of the Qualifying Program ',
            'The name of the Government or Tribal Agency that issued the document ',
            'An issue date within the last 12 months or a future expiration date'
          ];
          const slides = [{ asset: 'snap-geniric.png', title: 'Approval or Benefit Letter:' }];
          const text = [];
          this.docDetails.push({ closeTab:false, consent: false, category: cat, proofs, slides, text });
        }
        if (cat === 'Medicaid') {
          const proofs = [
            'Your Name, or your Dependent’s Name ',
            'The name of the Qualifying Program ',
            'The name of the Government or Tribal Agency that issued the document ',
            'An issue date within the last 12 months or a future expiration date'
          ];
          const slides = [{ asset: 'medcaid.png', title: 'Approval or Benefit Letter for Medicaid:' }];
          const text = [];
          this.docDetails.push({ closeTab:false, consent: false, category: cat, proofs, slides, text });
        }
        if (cat === 'Through income') {
          const proofs = [
            'Your Name, or your Dependent’s Name ',
            'Current income information (Monthly or annual income amount)',
            '3 consecutive months of paystubs (if provided)',
            'An issue date within the last 12 months or prior year’s tax document.'
          ];
          const slides = [{
            asset: 'income.png', title: `Prior year’s state, federal, or Tribal tax return 
            or a Social Security Benefit Statement.` }];
          const text = [];
          this.docDetails.push({ closeTab:false, consent: false, category: cat, proofs, slides, text });
        }
        if (cat === 'Pell Grant') {
          const proofs = [
            'Your Name, or your Dependent’s Name ',
            'The name of the Qualifying Program (not required for Community Eligibility Provision) ',
            'The name of the School or School district',
            'A current award year (Pell Grant)',
            `Dated for the current school year or the school year immediately preceding the application 
            (for school lunch or breakfast qualifying programs)`,
            `Address & Contact information for the school, school year for which the student is enrolled (require for Community Eligibility Provision)`
          ];
          const slides = [{
            asset: 'pell-grant1.png', title: `For Federal Pell Grants, written confirmation from a student’s school (college or university, 
            community college ,or career school) or the Department of 
            Education that the student has received a Pell Grant for the current award year.` },
          {
            asset: 'pell-grant2.png', title: `A letter from the school or school district that confirms that 
            a member of household receives free & reduced-price school
            lunch or school year immediately preceding the application`},
          {
            asset: 'pell-grant3.png', title: `For enrollment in a CEP school – School documentation on demonstrating 
        the student is enrolled in a CEP School for the relevant school year 
        (student must still be enrolled in the CEP school at the time of the application)`
          }];
          const text = [];
          this.docDetails.push({ closeTab:false, consent: false, category: cat, proofs, slides, text });
        }
      });
      this.cd.detectChanges();
      if (this.docDetails.length > 0) {
        this.createSwiper();
      }
    }
  }
} 
