import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IAcpDetails } from '@ztarmobile/zwp-service-backend-v2';
import { PageScrollService } from 'ngx-page-scroll-core';
import { takeWhile } from 'rxjs/operators';
import { AppState } from 'src/app/app.service';
import { EbbManager } from 'src/services/ebb.service';
import Swiper, { EffectFade, Keyboard, Navigation } from 'swiper';

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
  public incomeDesc: string;
  public config: any = {
    slidesPerView: 1,
    direction: 'horizontal',
    keyboard: true,
    mousewheel: false,
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
  public selectedCodes: Array<string>;
  public selectedCodesWithDescs: Array<{ code: string; description: string }> = [];
  public selectedCodesDescs: Array<string> = [];
  public docsCategories: Array<{ category: string; descs: Array<string> }> = [];
  public docDetails: Array<{ id: string, closeTab: boolean, consent: boolean, category: Array<string>; proofs: Array<any>; slides: Array<any>, text: Array<any> }> = [];

  private alive = true;
  private commonDescs = [];
  private e1E2Descs = [];
  private e1Descs = [];
  private e2Descs = [];
  private pellGrantDescs = [];
  private incomeDescs = [];
  constructor(private ebbManager: EbbManager, private appState: AppState,
    private cd: ChangeDetectorRef, private pageScrollService: PageScrollService) { }

  ngOnInit(): void {
    this.cd.detectChanges();
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 4) {
        this.consent = this.docDetails.every(item => item.consent);
        if (!this.consent) {
          this.nextClicked = true;
          const filteredArray = this.docDetails.filter(doc => doc.consent !== true);
          filteredArray.map((item) => {
            item.closeTab = false;
            setTimeout(() => {
              this.pageScrollService.scroll({
                document,
                scrollTarget: `#${item.id}`,
                scrollOffset: 100,
                speed: 150
              });
            }, 200);
          });
        }
        if (!!this.consent) {
          this.goToNext.emit(5);
        }
      }
    });
    if (!!this.internalData && !!this.internalData.eligibilityCode) {
      const state = this.internalData.user?.address?.primary?.state;
      this.appState.loading = true;
      this.ebbManager.eligibilityCodeDescs.subscribe(res => {
        this.appState.loading = false;
        console.log('RRRRRRRRRRRRREEEEEEEEEESSSSSSSSSSSSSSSS', res);
        
        if (!!res) {
          this.eligibilityCodes = res;
          this.selectedCodes = this.internalData?.eligibilityCode?.split(",");
          if (!!this.selectedCodes) {
            console.log('SSSSEEEELLEECCTTTEEDD CODES', this.selectedCodes);

            console.log('EEELLLEEEEE CODES', this.eligibilityCodes);
            
            this.selectedCodes.map((code) => {
              this.eligibilityCodes.map((item) => {
                if (item.code === code) {
                  if ((this.selectedCodesDescs.length > 1 || this.selectedCodesDescs.length === 1) && code === 'E13') {
                    this.doSplit = true;
                    this.incomeDesc = item?.description;
                  }
                  else {
                    this.selectedCodesDescs.push(item?.description);
                  }
                  // need this array to loop over it to display each code description related to specific category
                  this.selectedCodesWithDescs.push({ code: code, description: item?.description });
                }
              });
            });
            console.log('SSSSEEEELLEECCTTTEEDD CODES DESCS', this.selectedCodesDescs);
            
            this.checkDocGroups(this.selectedCodesWithDescs);
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
      modules: [Navigation, EffectFade, Keyboard],
      ...this.config
    });
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public docArrowClicked(index): void {
    this.docDetails[index].closeTab = !this.docDetails[index].closeTab;
    this.cd.detectChanges();
    if (this.docDetails[index].slides?.length > 1) {
      this.createSwiper();
    }
  }
  public checkDocGroups(selectedCodes): void {
    this.checkDocsDescs(selectedCodes);
    //check if some of the common codes related to generic group are selected 
    const commonCondition = selectedCodes.some(obj => obj.code === 'E54' || obj.code === 'E3' || obj.code === 'E4' || obj.code === 'E15' || obj.code === 'E8' || obj.code === 'E9' || obj.code === 'E10');
    // check the generic group
    if (commonCondition) {
      this.docsCategories.push({ category: 'Generic Group', descs: this.commonDescs });
    } //another case for generic
    if (!commonCondition && selectedCodes.some(obj => obj.code === 'E1') && selectedCodes.some(obj => obj.code === 'E2')) {
      this.docsCategories.push({ category: 'Generic Group', descs: this.e1E2Descs });
    } // check SNAP group
    if (!commonCondition && selectedCodes.some(obj => obj.code === 'E2') && !selectedCodes.some(obj => obj.code === 'E1')) {
      this.docsCategories.push({ category: 'SNAP', descs: this.e2Descs });
    } // check Medicaid group
    if (!commonCondition && selectedCodes.some(obj => obj.code === 'E1') && !selectedCodes.some(obj => obj.code === 'E2')) {
      this.docsCategories.push({ category: 'Medicaid', descs: this.e1Descs });
    } // check pell grant group
    if (selectedCodes.some(obj => obj.code === 'E50' || obj.code === 'E51')) {
      this.docsCategories.push({ category: 'Pell Grant', descs: this.pellGrantDescs });
    } // check income group
    if (selectedCodes.some(obj => obj.code === 'E13')) {
      this.docsCategories.push({ category: 'Through income', descs: this.incomeDescs });
    }
    this.cd.detectChanges();
    this.checkProofs();
  }
  private checkProofs(): void {
    if (this.docsCategories?.length > 0) {
      this.docsCategories.map(cat => {
        if (cat.category === 'Generic Group') {
          const proofs = [
            `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
            `The name of the <b>Qualifying Program</b>.`,
            `The name of the <b>Government</b> or <b>Tribal Agency</b> that issued the document.`,
            `An issue date within the last <b>12 months</b> or a <b>future expiration date</b>.`
          ];
          const slides = [{ asset: 'snap-geniric.png', title: 'Approval or Benefit Letter:' }];
          const text = ['Screenshot of Online Portal', 'Survivors Benefit Summary Letter'];
          this.docDetails.push({ id: 'generic', closeTab: false, consent: false, category: cat.descs, proofs, slides, text });
        }
        if (cat.category === 'SNAP') {
          const proofs = [
            `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
            `The name of the <b>Qualifying Program</b>.`,
            `The name of the <b>Government</b> or <b>Tribal Agency</b> that issued the document.`,
            `An issue date within the last <b>12 months</b> or a <b>future expiration date</b>.`
          ];
          const slides = [{ asset: 'snap-geniric.png', title: 'Approval or Benefit Letter:' }];
          const text = [];
          this.docDetails.push({ id: 'snap', closeTab: false, consent: false, category: cat.descs, proofs, slides, text });
        }
        if (cat.category === 'Medicaid') {
          const proofs = [
            `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
            `The name of the <b>Qualifying Program</b>.`,
            `The name of the <b>Government</b> or <b>Tribal Agency</b> that issued the document.`,
            `An issue date within the last <b>12 months</b> or a <b>future expiration date</b>.`
          ];
          const slides = [{ asset: 'medcaid.png', title: 'Approval or Benefit Letter for Medicaid:' }];
          const text = [];
          this.docDetails.push({ id: 'medicaid', closeTab: false, consent: false, category: cat.descs, proofs, slides, text });
        }
        if (cat.category === 'Through income') {
          const proofs = [
            `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
            `<b>Current income</b> information (Monthly or annual income amount).`,
            `<b>3 consecutive months</b> of paystubs (if provided).`,
            `An issue date within the last <b>12 months</b> or <b>prior year’s tax document</b>.`
          ];
          const slides = [{
            asset: 'income.png', title: `Prior year’s state, federal, or Tribal tax return 
            or a Social Security Benefit Statement.` }];
          const text = [];
          this.docDetails.push({ id: 'income', closeTab: false, consent: false, category: cat.descs, proofs, slides, text });
        }
        if (cat.category === 'Pell Grant') {
          const proofs = [
            `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
            `The name of the <b>Qualifying Program</b> (not required for Community Eligibility Provision).`,
            `The name of the <b>School</b> or <b>School district</b>.`,
            `A <b>current</b> award year (Pell Grant).`,
            `<b>Dated</b> for the <b>current school year</b> or the </b>school year immediately preceding the application</b>
            (for school lunch or breakfast qualifying programs).`,
            `<b>Address</b> & <b>Contact information</b> for the <b> school, school year</b>  for which the student is enrolled (require for Community Eligibility Provision).`
          ];
          const slides = [{
            asset: 'pell-grant1.png', title: `For Federal Pell Grants, written confirmation from a student’s school (college or university, 
            community college, or career school) or the Department of 
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
          this.docDetails.push({ id: 'pell-grant', closeTab: false, consent: false, category: cat.descs, proofs, slides, text });
        }
      });
      this.cd.detectChanges();
      if (this.docDetails.length > 0) {
        this.createSwiper();
      }
    }
  }
  private checkDocsDescs(selectedCodes): void {
    selectedCodes.map(elm => {
      if (elm.code === 'E54' || elm.code === 'E3' || elm.code === 'E4' || elm.code === 'E15' || elm.code === 'E8' || elm.code === 'E9' || elm.code === 'E10' || elm.code === 'E1' || elm.code === 'E2') {
        this.commonDescs.push(elm?.description);
      }
      if (elm.code === 'E1' || elm.code === 'E2') {
        this.e1E2Descs.push(elm?.description);
      }
      if (elm.code === 'E2') {
        this.e2Descs.push(elm?.description);
      }
      if (elm.code === 'E1') {
        this.e1Descs.push(elm?.description);
      }
      if (elm.code === 'E50' || elm.code === 'E51') {
        this.pellGrantDescs.push(elm?.description);
      }
      if (elm.code === 'E13') {
        this.incomeDescs.push(elm?.description);
      }
    });
  }
} 
