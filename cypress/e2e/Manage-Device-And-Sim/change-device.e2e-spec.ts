import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Change device from manage device and sim page ', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST_USER.EMAIL, CONSTANT.ACCESS.TEST_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to the account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('click on manage device and sim ', () => {
        PageObjects.AccountSummary.clickOnManageDeviceAndSim();
    });
    it('Should go to manage devices page', () => {
        PageObjects.TitleExpectations.goToManageDevicesPage();
    });
    //
    it('click on check another device', () => {
        PageObjects.ManageDevices.clickOnCheckAnotherDevice();
    });
    // check compatiility  valid imei - invalid address
    it('fill in valid IMEI and  invalid address ref', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_TMO_HTC);
        PageObjects.Compatibility.addressRefNotSelectedFromList();
    });
    it(`Should check the invisible recaptcha `, () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it(`Should click on validate btn `, () => {
        PageObjects.ManageDevices.clickOnValidate();
    });
    it(`Should assert validation message`, () => {
        cy.get('#required-address-msg').should('have.text','Please select address from the autocomplete list');
    });
    it('Should stay in the page', () => {
        PageObjects.TitleExpectations.goToManageDevicesPage();
    });
    // check compatibility - invalid imei - valid address ref
    it('fill in invalid IMEI and valid address ref', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
        PageObjects.Compatibility.enterAddressRef();
    });
    it(`Should check the invisible recaptcha `, () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it(`Should assert validation message`, () => {
        cy.get('[data-cy="validationMsgInvalidIMEI"]').should('have.text', ' Field should be filled out with correct IMEI Number. ');
    });
    it('Should stay in the page', () => {
        PageObjects.TitleExpectations.goToManageDevicesPage();
    });
    // check compatibility - invalid imei - invalid address ref
    it('fill in invalid IMEI and invalid address ref', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
        PageObjects.Compatibility.addressRefNotSelectedFromList();
    });
    it(`Should check the invisible recaptcha `, () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it(`Should assert validation message`, () => {
        cy.get('[data-cy="validationMsgInvalidIMEI"]').should('have.text', ' Field should be filled out with correct IMEI Number. ');
    });
    it('Should stay in the page', () => {
        PageObjects.TitleExpectations.goToManageDevicesPage();
    });
    // Enter valid compatibility data
    it('fill in IMEI and address ref', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.TMO_ONLY.TMO1);
        PageObjects.Compatibility.enterTmoAddressRef();
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('click on validate btn', () => {
        PageObjects.ManageDevices.clickOnValidate();
    });
    it('click on got it btn', () => {
        PageObjects.ManageDevices.clickOnGotItBtn();
    });
    it('Should stay in same page page', () => {
        PageObjects.TitleExpectations.goToManageDevicesPage();
    });
});