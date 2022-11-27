import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings and edit the address - invalid/required and unrelated data cases', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.PROFILE.MOCK_DATA.EMAIL, CONSTANT.PROFILE.MOCK_DATA.NEW_PASSWORD);
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
    it('Should click on edit shipping address icon', () => {
        PageObjects.ProfileSettings.clickOnEditAddressIcon();
    });
    it('Should leave fields empty', () => {
        cy.get('[data-cy="addressName"]').click();
        cy.get('[data-cy="addressName"]').clear();
        cy.get('[data-cy="addressLookup"]').click();
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="suiteNo"]').click();
        cy.get('[data-cy="suiteNo"]').clear();
        cy.get('[data-cy="billingCity"]').click();
        cy.get('[data-cy="billingCity"]').clear();
        cy.get('[data-cy="billingState"]').click();
        cy.get('[data-cy="billingState"]').clear();
        cy.get('[data-cy="billingPostal"]').click();
        cy.get('[data-cy="billingPostal"]').clear();
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the required validation messages', () => {
        cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text', 'Address name is a required field');
        cy.get('[data-cy="addressIsRequiredMSG"]').should('have.text', 'Address is a Required Field');
        cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
        cy.get('[data-cy="stateIsRequired"]').should('have.text', 'State is a Required Field ');
        cy.get('[data-cy="save"]').should('be.disabled');
    });
    it('Should fill in invalid address data ', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.INVALID_ADDRESS.NAME,
            CONSTANT.SHIPPING.INVALID_ADDRESS.ADDRESS1,
            CONSTANT.SHIPPING.INVALID_ADDRESS.SUITE_NO,
            CONSTANT.SHIPPING.INVALID_ADDRESS.CITY,
            CONSTANT.SHIPPING.INVALID_ADDRESS.STATE,
            CONSTANT.SHIPPING.INVALID_ADDRESS.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
        cy.get('[data-cy="save"]').should('be.disabled');
    });
    it('Should fill in invalid city', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA2.NAME,
            CONSTANT.SHIPPING.SHIPPING_DATA2.ADDRESS1,
            CONSTANT.SHIPPING.SHIPPING_DATA2.SUITE_NO,
            CONSTANT.SHIPPING.INVALID_ADDRESS.CITY,
            CONSTANT.SHIPPING.SHIPPING_DATA2.STATE,
            CONSTANT.SHIPPING.SHIPPING_DATA2.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid city validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="save"]').should('be.disabled');
    });
    it('Should fill in invalid state', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA2.NAME,
            CONSTANT.SHIPPING.SHIPPING_DATA2.ADDRESS1,
            CONSTANT.SHIPPING.SHIPPING_DATA2.SUITE_NO,
            CONSTANT.SHIPPING.SHIPPING_DATA2.CITY,
            CONSTANT.SHIPPING.INVALID_ADDRESS.STATE,
            CONSTANT.SHIPPING.SHIPPING_DATA2.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid state validation messages', () => {
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="save"]').should('be.disabled');
    });
    it('Should fill in invalid postal code', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA2.NAME,
            CONSTANT.SHIPPING.SHIPPING_DATA2.ADDRESS1,
            CONSTANT.SHIPPING.SHIPPING_DATA2.SUITE_NO,
            CONSTANT.SHIPPING.SHIPPING_DATA2.CITY,
            CONSTANT.SHIPPING.SHIPPING_DATA2.STATE,
            CONSTANT.SHIPPING.INVALID_ADDRESS.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid postal code validation messages', () => {
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
        cy.get('[data-cy="save"]').should('be.disabled');
    });
    it('Should efill in unrelated address data - CITY', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.UNRELATED_ADDRESS_CITY.NAME,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_CITY.ADDRESS1,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_CITY.SUITE_NO,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_CITY.CITY,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_CITY.STATE,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_CITY.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should click on save button', () => {
        PageObjects.ProfileSettings.clickOnSaveShippingInfo();
    });
    it('Should address validation pop up and then close it ', () => {
        cy.get(':nth-child(2) > [data-cy="action-button"]').should('exist');
        cy.get('.modal-heading').should('have.text', 'Verify your shipping address');
        PageObjects.ProfileSettings.clickOnCloseIcon();
    });
    it('Should click on edit shipping address icon', () => {
        PageObjects.ProfileSettings.clickOnEditAddressIcon();
    });
    it('Should efill in unrelated address data - STATE', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.UNRELATED_ADDRESS_STATE.NAME,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_STATE.ADDRESS1,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_STATE.SUITE_NO,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_STATE.CITY,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_STATE.STATE,
            CONSTANT.SHIPPING.UNRELATED_ADDRESS_STATE.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should click on save button', () => {
        PageObjects.ProfileSettings.clickOnSaveShippingInfo();
    });
    it('Should address validation pop up and then close it ', () => {
        cy.get(':nth-child(2) > [data-cy="action-button"]').should('exist');
        cy.get('.modal-heading').should('have.text', 'Verify your shipping address');
        PageObjects.ProfileSettings.clickOnCloseIcon();
    });

});
