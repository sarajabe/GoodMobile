import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Coverage & Device check - invalid IMEI', () => {
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
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    // Both TMO & ATT coverage - INVALID IMEI
    it('Should enter covered address on both ATT & TMO', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert that the address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number - ATT', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.INVAID.INVALID1);
    });
    it('Should click on check your device btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it('Should stay in check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should assert that the device is incompatible', () => {
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
        cy.get('.banner-content > .desc').should('have.text','Your device is not compatible.');
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
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    // ATT Coverage - INVALID IMEI
    it('Should enter covered address - ATT', () => {
        PageObjects.Coverage.enterAddressRefATTCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert that the address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number - ATT', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.INVAID.INVALID1);
    });
    it('Should click on check your device btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it('Should stay in check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should assert that the device is incompatible', () => {
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
        cy.get('.banner-content > .desc').should('have.text','Your device is not compatible.');
    });
    it('Should click on retry', () => {
        PageObjects.Compatibility.clickOnCheckAgain();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    // TMO Coverage - INVALID IMEI
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number - ATT', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.INVAID.INVALID1);
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it(`Should stay in Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should assert that the device is incompatible', () => {
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
        cy.get('.banner-content > .desc').should('have.text','Your device is not compatible.');
    });
});