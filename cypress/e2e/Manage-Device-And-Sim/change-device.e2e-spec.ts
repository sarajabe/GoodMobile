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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
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
    it('click on i have a new phone btn', () => {
        PageObjects.ManageDevices.clickOnChangePhone();
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
    it(`Should click on check phone btn `, () => {
        cy.get('[data-cy="validationMsgInvalidIMEI"]').should('have.text', ' Field should be filled out with correct IMEI/MEID Number. ');
    });
    it(`Should check that the validate btn is disabled`, () => {
        cy.get('[data-cy="validateBtn"]').should('be.disabled');
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
    it(`Should check that the validate btn is disabled`, () => {
        cy.get('[data-cy="validationMsgInvalidIMEI"]').should('have.text', ' Field should be filled out with correct IMEI/MEID Number. ');
        cy.get('[data-cy="validateBtn"]').should('be.disabled');
    });
    it('Should stay in the page', () => {
        PageObjects.TitleExpectations.goToManageDevicesPage();
    });
    // Enter valid compatibility data
    it('fill in IMEI and address ref', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_TMO_HTC);
        PageObjects.Compatibility.enterAddressRef();
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('click on validate btn', () => {
        PageObjects.ManageDevices.clickOnValidate();
    });
    it('click on ok btn', () => {
        PageObjects.ManageDevices.clickOnOkBtn();
    });
    it('Should stay in same page page', () => {
        PageObjects.TitleExpectations.goToManageDevicesPage();
    });
});