import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings,add new shipping address and save - delete it', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on sign in', () => {
        PageObjects.HomePage.clickOnSignIn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on Profile settings', () => {
        PageObjects.AccountSummary.clickOnProfileSetting();
    });
    it('Should go to Settings page', () => {
        PageObjects.TitleExpectations.goToProfileSettingsPage();
    });
    it('Should click on add another address', () => {
        PageObjects.ProfileSettings.clickOnAddAnotherAddress();
    });
    it('Should leave fields empty', () => {
        cy.get('[data-cy="alias"]').clear();
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="suiteNo"]').clear();
        cy.get('[data-cy="billingCity"]').clear();
        cy.get('[data-cy="billingState"]').clear();
        cy.get('[data-cy="billingPostal"]').clear();
        cy.get('[data-cy="alias"]').clear();
    });
    it('Should assert the required validation messages', () => {
        cy.get('[data-cy="addressNameReuiredMsg"]').should('have.text', 'Address name is required field');
        cy.get('[data-cy="addressRequiredMsg"]').should('have.text', 'Address is a Required Field');
        cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
        cy.get('[data-cy="stateIsRequired"]').should('have.text', 'State is a Required Field ');
        cy.get('[data-cy="postalIsRequired"]').should('have.text', 'Postal Code is a Required Field');
    });
    it('Should click on save button', () => {
        PageObjects.ProfileSettings.clickOnSaveButton();
    });
    it('Should assert the required validation messages', () => {
        cy.get('[data-cy="addressNameReuiredMsg"]').should('have.text', 'Address name is required field');
        cy.get('[data-cy="addressRequiredMsg"]').should('have.text', 'Address is a Required Field');
        cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
        cy.get('[data-cy="stateIsRequired"]').should('have.text', 'State is a Required Field ');
        cy.get('[data-cy="postalIsRequired"]').should('have.text', 'Postal Code is a Required Field');
    });
    it('Should add invalid address info', () => {
        PageObjects.ShippingPage.addAddressInfo1(CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.NAME,
            CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.SHIPPING_ADDRESS,
            CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.SUITE_NO);
        PageObjects.ShippingPage.addShippingInfo2(CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.CITY,
            CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.STATE,
            CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.POSTAL);
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should click on save button', () => {
        PageObjects.ProfileSettings.clickOnSaveButton();
    });
    it('Should click on edit address from the pop up', () => {
        PageObjects.ProfileSettings.clickOnEditAddress();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should add valid address info', () => {
        PageObjects.ShippingPage.addAddressInfo1(CONSTANT.SHIPPING.SHIPPING_DATA2.NAME,
            CONSTANT.SHIPPING.SHIPPING_DATA2.ADDRESS1,
            CONSTANT.SHIPPING.SHIPPING_DATA2.SUITE_NO);
        PageObjects.ShippingPage.addShippingInfo2(CONSTANT.SHIPPING.SHIPPING_DATA2.CITY,
            CONSTANT.SHIPPING.SHIPPING_DATA2.STATE,
            CONSTANT.SHIPPING.SHIPPING_DATA2.POSTAL);
    });
    it('Should click on save new address button', () => {
        PageObjects.ProfileSettings.clickOnSaveNewAddress();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should choose keep current address ', () => {
        PageObjects.ShippingPage.chooseKeepCurrentAddress();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on all addresses in book to view the last added address', () => {
        PageObjects.ProfileSettings.clickOnAllAdressesInBook();
    });
    it('Should remove last added address', () => {
        cy.get('#removeAddress-3').click();
    });
    it('Should click on save button from the pop uo', () => {
        PageObjects.ProfileSettings.clickOnSaveButtonFromPopUp();
    });
    it('Should stay in profile setting page', () => {
        PageObjects.TitleExpectations.goToProfileSettingsPage();
    });
});
