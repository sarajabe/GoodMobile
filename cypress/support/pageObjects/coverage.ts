
import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from "../../fixtures/constants";

class Coverage {

    enterIMEInumber(imei) {
        cy.get('[data-cy=equipmentNumber]').clear();
        cy.get('[data-cy=equipmentNumber]').type(imei);
        return this;
    };
    enterAddressRefNoCoverage() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').clear();
        cy.get('[data-cy="addressRef"]').type('Jordan Creek Parkway,West Des Moines,IA undefined');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        cy.get('.mat-option-text').first().click();
        return this;
    };
    enterAddressRefTMO() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').clear();
        cy.get('[data-cy="addressRef"]').type('325 North Saint Paul Street, Dallas, TX 75201');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        cy.get('.mat-option-text').first().click();
        return this;
    };
    enterAddressRefATT() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').clear();
        cy.get('[data-cy="addressRef"]').type('16 Village Ln, Colleyville, TX 76034');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        cy.get('.mat-option-text').first().click();
        return this;
    };
    invalidAddressRef() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').clear();
        cy.get('[data-cy="addressRef"]').type('m').then(() => {
            cy.get('.mat-option-text').first().click();
        });
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    addressRefNotSelectedFromList() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').clear();
        cy.get('[data-cy="addressRef"]').type('mjgf');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    assertAddressIsRequired(){
        cy.get('#required-address-msg').should('have.text','Address is a Required Field');
    }
    assertAddressNotSelectedFromList(){
        cy.get('#required-address-msg').should('have.text','Please select address from the autocomplete list');
    }
    clickOnNextStepBtn() {
        cy.get('[data-cy="nextStepBtn"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    enterAddressRefBothCoverages() {
        cy.get('[data-cy="addressRef"]').click({force:true});
        cy.get('[data-cy="addressRef"]').clear();
        cy.get('[data-cy="addressRef"]').type('123 William St, New York, NY 10038').then(() => {
            cy.get('.mat-option-text').first().click();
        });
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    enterAddressRefATTCoverages() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').clear();
        cy.get('[data-cy="addressRef"]').type('16 Village Ln, Colleyville, TX 76034').then(() => {
            cy.get('.mat-option-text').first().click();
        });
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    enterAddressRefTMOCoverages() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('325 North Saint Paul Street, Dallas, TX 75201').then(() => {
            cy.get('.mat-option-text').first().click();
        });
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    enterIccidnumber(imei) {
        cy.get('#iccidNumber').clear();
        cy.get('#iccidNumber').type(imei);
        return this;
    };
    clickOnCheckYourPhoneBtn() {
        cy.get('[data-cy="checkYourPhoneBtn"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    clickOnCheckCoverageBtn() {
        cy.get('[data-cy="check-coverage"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    purchasePlanCheckBothCoverageDeviceInvalidCases(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('[data-cy="requiredAddressValidationMsg"]').should('have.text','Address is a Required Field');
        this.addressRefNotSelectedFromList();
        this.clickOnCheckCoverageBtn();
        cy.get('[data-cy="selectAddressValidationMsg"]').should('have.text','Please select address from the autocomplete list');
        this.enterAddressRefBothCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.clickOnCheckYourDevice();
        cy.get('#required-equipment-msg').should('have.text',' This field is required ');
        this.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        cy.get('[data-cy="invalid-equipmentNumber-msg"]').should('have.text', ' Invalid serial, it should be between 11-18 digits ');
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.INVALID_IMEI);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
    };
    purchasePlanCheckAttCoverageDeviceInvalidCases(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('[data-cy="requiredAddressValidationMsg"]').should('have.text','Address is a Required Field');
        this.addressRefNotSelectedFromList();
        this.clickOnCheckCoverageBtn();
        cy.get('[data-cy="selectAddressValidationMsg"]').should('have.text','Please select address from the autocomplete list');
        this.enterAddressRefATTCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.clickOnCheckYourDevice();
        cy.get('#required-equipment-msg').should('have.text',' This field is required ');
        this.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        cy.get('[data-cy="invalid-equipmentNumber-msg"]').should('have.text', ' Invalid serial, it should be between 11-18 digits ');
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.INVALID_IMEI);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
    };
    purchasePlanCheckTmoCoverageDeviceInvalidCases(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('[data-cy="requiredAddressValidationMsg"]').should('have.text','Address is a Required Field');
        this.addressRefNotSelectedFromList();
        this.clickOnCheckCoverageBtn();
        cy.get('[data-cy="selectAddressValidationMsg"]').should('have.text','Please select address from the autocomplete list');
        this.enterAddressRefTMOCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.clickOnCheckYourDevice();
        cy.get('#required-equipment-msg').should('have.text',' This field is required ');
        this.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        cy.get('[data-cy="invalid-equipmentNumber-msg"]').should('have.text', ' Invalid serial, it should be between 11-18 digits ');
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.INVALID_IMEI);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
    };
    purchasePlanCheckAttCoverageSkipDevice(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.enterAddressRefATTCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.clickOnSkipForNowLink();
        cy.get('[data-cy="skipDeviceCheckMessage"]').should('have.text',' The service will only work on 4G/5G VoLTE compatible devices. By skipping this step, there is no way to know if your phone is compatible with our networks. Is your phone 4G or 5G and VoLTE compatible? ');
        PageObjects.Compatibility.clickOnYesFromThePopUp();
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
        PageObjects.ReviewCart.clickOnEmptyCart();
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
        PageObjects.TitleExpectations.goToHomePage();
    };
    purchasePlanCheckTmoCoverageSkipDevice(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.enterAddressRefTMOCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.clickOnSkipForNowLink();
        cy.get('[data-cy="skipDeviceCheckMessage"]').should('have.text',' The service will only work on 4G/5G VoLTE compatible devices. By skipping this step, there is no way to know if your phone is compatible with our networks. Is your phone 4G or 5G and VoLTE compatible? ');
        PageObjects.Compatibility.clickOnYesFromThePopUp();
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
        PageObjects.ReviewCart.clickOnEmptyCart();
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
        PageObjects.TitleExpectations.goToHomePage();
    };
    purchasePlanCheckBothCoverageAttDevice(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.enterAddressRefBothCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.ATT_ONLY.ATT1);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
        cy.get('[data-cy="compatibilityResult"]').should('have.text', ' Congrats!');
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
        PageObjects.ReviewCart.clickOnEmptyCart();
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
        PageObjects.TitleExpectations.goToHomePage();
    };
    purchasePlanCheckAttCoverageAttDevice(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.enterAddressRefATTCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.ATT_ONLY.ATT1);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
        cy.get('[data-cy="compatibilityResult"]').should('have.text', ' Congrats!');
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
        PageObjects.ReviewCart.clickOnEmptyCart();
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
        PageObjects.TitleExpectations.goToHomePage();
    };
    purchasePlanCheckTmoCoverageAttDevice(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.enterAddressRefTMOCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.ATT_ONLY.ATT1);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
    };
    purchasePlanCheckBothCoverageTmoDevice(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.enterAddressRefBothCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.TMO_ONLY.TMO1);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
        cy.get('[data-cy="compatibilityResult"]').should('have.text', ' Congrats!');
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
        PageObjects.ReviewCart.clickOnEmptyCart();
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
        PageObjects.TitleExpectations.goToHomePage();
    };
    purchasePlanCheckTmoCoverageTmoDevice(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.enterAddressRefTMOCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.TMO_ONLY.TMO1);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
        cy.get('[data-cy="compatibilityResult"]').should('have.text', ' Congrats!');
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
        PageObjects.ReviewCart.clickOnEmptyCart();
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
        PageObjects.TitleExpectations.goToHomePage();
    };
    purchasePlanCheckAttCoverageTmoDevice(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.HomePage.clickOnPlans();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        this.enterAddressRefATTCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        this.clickOnNextStepBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.TMO_ONLY.TMO1);
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
    };

    clickOnCheckCoverageButton(){
        cy.get('[data-cy="check-coverage-button"]').click({force:true});
        return this;
    };
    assertAddressCoverdBanner(){
        cy.get('[data-cy="awesomeMsg"]').should('have.text','Awesome!');
        cy.get('[data-cy="youAareCoveredMsg"]').should('have.text','You are covered by our wireless networks!');
        cy.get('[data-cy="goToPurchasePlanMsg"]').should('have.text','You can go ahead and purchase a plan that works best for you.');
        cy.get('[data-cy="shopPlanBtn"]').should('exist');
    };
    checkCoverageATT(){
        PageObjects.HomePage.clickOnCoverage();
        PageObjects.TitleExpectations.goToGMCoveragePage();
        this.enterAddressRefATTCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageButton();
        PageObjects.TitleExpectations.goToGMCoveragePage();
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=att;zipCode=76034`);
        this.assertAddressCoverdBanner();
    };
    checkCoverageTMO(){
        PageObjects.HomePage.clickOnCoverage();
        PageObjects.TitleExpectations.goToGMCoveragePage();
        this.enterAddressRefTMOCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageButton();
        PageObjects.TitleExpectations.goToGMCoveragePage();
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=tmo;zipCode=75201`);
        this.assertAddressCoverdBanner();
    };
    checkCoverageBothAddressRef(){
        PageObjects.HomePage.clickOnCoverage();
        PageObjects.TitleExpectations.goToGMCoveragePage();
        this.enterAddressRefBothCoverages();
        PageObjects.Recaptcha.invisibleRecaptcha();
        this.clickOnCheckCoverageButton();
        PageObjects.TitleExpectations.goToGMCoveragePage();
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=tmo;zipCode=10038`);
        this.assertAddressCoverdBanner();
    };
    checkCoverageEmptyField(){
        PageObjects.HomePage.clickOnCoverage();
        PageObjects.TitleExpectations.goToGMCoveragePage();
        this.clickOnCheckCoverageButton();
        PageObjects.TitleExpectations.goToGMCoveragePage();
        cy.get('[data-cy="requiredAddressValidationMsg"]').should('have.text','Full Address is required');
    };
    checkCoverageNotSelectedFromList(){
        PageObjects.HomePage.clickOnCoverage();
        PageObjects.TitleExpectations.goToGMCoveragePage();
        this.addressRefNotSelectedFromList();
        this.clickOnCheckCoverageButton();
        cy.get('[data-cy="selectAddressValidationMsg"]').should('have.text','Please select address from the autocomplete list');
    };
};
export default new Coverage();
