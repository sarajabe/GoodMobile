import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'
describe('Check coverage from header - TMO, ATT and both coverages - not logged in', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on coverage from the header', () => {
        PageObjects.HomePage.clickOnCoverage();
    });
    it('Should leave address field empty and click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert the required address validation message', () => {
        cy.get('[data-cy="selectAddressValidationMsg"]').should('have.text','Full Address is required');
    });
    it('Should enter an address that is not selected from the autofill list', () => {
        PageObjects.Coverage.addressRefNotSelectedFromList();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert the validation message of address not selected from the autofill list', () => {
        cy.get('[data-cy="selectAddressValidationMsg"]').should('have.text','Please select address from the autocomplete list');
    });
    it('Should clear address Ref', () => {
        cy.get('[data-cy="addressRef"]').clear();
    });
    it('Should enter covered address - ATT', () => {
        PageObjects.Coverage.enterAddressRefATTCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert that the coverage result is ATT', () => {
        cy.get('[href="https://www.att.com"]').should('have.text','AT&T');
    });
    it('The url should include support/coverage;networkType=att;zipCode=76034', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=att;zipCode=76034`);
    });
    it('Should click on coverage from the header', () => {
        PageObjects.HomePage.clickOnCoverage();
    });
    it('Should enter covered address - TMO', () => {
        PageObjects.Coverage.enterAddressRefTMOCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert that the coverage result is TMO', () => {
       cy.get('[href="https://www.T-mobile.com"]').should('have.text','T-Mobile');
    });
    it('The url should include support/coverage;networkType=tmo;zipCode=75201', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=tmo;zipCode=75201`);
    });
    it('Should click on coverage from the header', () => {
        PageObjects.HomePage.clickOnCoverage();
    });
    it('Should enter covered address on both ATT & TMO', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert that the coverage result is TMO', () => {
        cy.get('[href="https://www.T-mobile.com"]').should('have.text','T-Mobile');
    });
    it('The url should include support/coverage;networkType=tmo;zipCode=10038', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=tmo;zipCode=10038`);
    });
})

    