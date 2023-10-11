import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

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
    clickOnCheckCoverageBtn() {
        cy.get('[data-cy="check-coverage"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
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
