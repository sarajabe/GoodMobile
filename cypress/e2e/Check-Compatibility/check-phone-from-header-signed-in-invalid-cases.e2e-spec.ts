import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Check compatibility from header - signed in - invalid cases', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Click on sign in from the header', () => {
        PageObjects.HomePage.clickOnSignIn();
    });
    it('Should go to the sign page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it(`Should fill in fields with existing customer email and password`, () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to the account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    })
    it('Click on check your phone from the header', () => {
        PageObjects.HomePage.clickOnBringYourPhone();
    });
    it('Should go to check you phone page', () => {
        PageObjects.TitleExpectations.goToBringYourPhonePage();
    });
    it('Should click on get started btn', () => {
        PageObjects.Compatibility.clickOnGetStartedBtn();
    });
    it('Should go to check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    // check compatiility - invalid address
    it('Click on check your phone from the header', () => {
        PageObjects.HomePage.clickOnBringYourPhone();
    });
    it('Should go to check you phone page', () => {
        PageObjects.TitleExpectations.goToBringYourPhonePage();
    });
    it('Should click on get started btn', () => {
        PageObjects.Compatibility.clickOnGetStartedBtn();
    });
    it('Should go to check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    it('fill in valid IMEI and invalid address ref', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_TMO_HTC);
        PageObjects.Compatibility.addressRefNotSelectedFromList();
    });
    it(`Should check the invisible recaptcha`, () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it(`Should click on check phone btn`, () => {
        PageObjects.Compatibility.clickOnCheckPhoneButton();
    });
    it('Should stay in the page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    // check compatibility - invalid imei - valid address ref
    it('Click on check your phone from the header', () => {
        PageObjects.HomePage.clickOnBringYourPhone();
    });
    it('Should go to check you phone page', () => {
        PageObjects.TitleExpectations.goToBringYourPhonePage();
    });
    it('Should click on get started btn', () => {
        PageObjects.Compatibility.clickOnGetStartedBtn();
    });
    it('Should go to check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    it('fill in invalid IMEI and valid address ref', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
        PageObjects.Compatibility.enterAddressRef();
    });
    it(`Should check the invisible recaptcha `, () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check phone button', () => {
        PageObjects.Compatibility.clickOnCheckPhoneButton();
    });
    it(`Should assert the invalid imei message `, () => {
        cy.get('[data-cy="invalid-equipmentNumber-msg"]').should('have.text', ' Invalid serial, it should be between 11-18 digits ');
    });
    it('Should stay in the page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    // check compatibility - invalid imei - invalid address ref
    it('Click on check your phone from the header', () => {
        PageObjects.HomePage.clickOnBringYourPhone();
    });
    it('Should go to check you phone page', () => {
        PageObjects.TitleExpectations.goToBringYourPhonePage();
    });
    it('Should click on get started btn', () => {
        PageObjects.Compatibility.clickOnGetStartedBtn();
    });
    it('Should go to check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    it('fill in invalid IMEI and invalid address ref', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
        PageObjects.Compatibility.addressRefNotSelectedFromList();
    });
    it(`Should check the invisible recaptcha`, () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check phone button', () => {
        PageObjects.Compatibility.clickOnCheckPhoneButton();
    });
    it(`Should click on check phone btn`, () => {
        cy.get('#invalid-equipment-msg').should('have.text', ' Invalid serial, it should be between 11-18 digits ');
    });
    it('Should stay in the page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
});