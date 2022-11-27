import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'
describe('Coverage and device check invalid', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on shop menu', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it('Should click on coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert the required validation messages', () => {
        cy.get('#required-address-msg').should('have.text','Address is a Required Field');
    }); 
    it('Should enter an address that is not selected from the autofill list', () => {
        PageObjects.Coverage.addressRefNotSelectedFromList();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert that the coverage address wasn’t selected from the autofill list', () => {
        cy.get('#required-address-msg').should('have.text','Please select address from the autocomplete list');
    }); 
    it(`Should stay in Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should clear the addressRef', () => {
        cy.get('[data-cy=addressRef]').clear()
    });
    it('Should enter covered address on both ATT & TMO', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it(`Should stay in Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should assert that address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it('Should assert the required validation messages', () => {
        cy.get('#required-equipment-msg').should('have.text',' This field is required ');
    }); 
    it('Should enter an invalid IMEI', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.INVALID_IMEI);
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it('Should assert that the device is incompatible', () => {
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
    });
})