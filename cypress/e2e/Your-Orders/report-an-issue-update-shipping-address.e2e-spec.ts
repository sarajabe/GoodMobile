import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,then to report an issue page and click on update address option, add address', () => {
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
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders7thChild();
    });
    it('Should go to your orders page', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on view invoice', () => {
        PageObjects.YouOrders.clickOnOrderDetails();
    });
    it('Should go to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should click on report an issue', () => {
        PageObjects.YouOrders.clickOnReportAnIssue();
    });
    it('Should go to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    it('Should click on update shipping shipping address option', () => {
        PageObjects.YouOrders.clickOnUpdateShippingAddress();
    });
    it('Should go to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });
    it('Should click on add new shipping address', () => {
        PageObjects.YouOrders.clickOnAddANewAddress();
    });
    it('Should go to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });
    // leave the fields empty and assert the required validation messages
    it('Should click on save btn', () => {
        PageObjects.YouOrders.clickOnSave();
    });
    it('Should assert the validation message for fields to be required', () => {
        cy.get('[data-cy="addressNameIsRequiredMSG"]').should('have.text', ' Address Name is a required field');
        cy.get('[data-cy="addressIsRequiredMSG"]').should('have.text', 'Address is a Required Field');
        cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
        cy.get('[data-cy="stateIsRequired"]').should('have.text', 'State is a Required Field ');
        cy.get('[data-cy="postalIsRequired"]').should('have.text', 'Postal Code is a Required Field');
    });
    it('Should fill in invalid info address info', () => {
        PageObjects.YouOrders.addShippingAddress(CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.NAME, 
            CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.CITY,
            CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.STATE,
            CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.POSTAL,
            CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.SHIPPING_ADDRESS);
    });
    it('Should assert the validation message for the invalid fields', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should click on cancel btn', () => {
        PageObjects.YouOrders.clickOnCancelBtn();
    });
    it('Should click on yes btn from pop up', () => {
        PageObjects.YouOrders.clickOnYesFromPopUp();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should go to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    it('Should click on update shipping shipping address option', () => {
        PageObjects.YouOrders.clickOnUpdateShippingAddress();
    });
    it('Should go to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });
    it('Should click on add a new address', () => {
        PageObjects.YouOrders.clickOnAddANewAddress();
    });
    it('Should fill in address info', () => {
        PageObjects.YouOrders.addShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA.NAME, 
            CONSTANT.SHIPPING.SHIPPING_DATA.CITY,
            CONSTANT.SHIPPING.SHIPPING_DATA.STATE,
            CONSTANT.SHIPPING.SHIPPING_DATA.POSTAL,
            CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS);
    });
    it('Should click on update btn', () => {
        PageObjects.YouOrders.clickOnSave();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
    });
    it('Should click on use verified address from pop up', () => {
        PageObjects.ShippingPage.chooseVerifiedAddress();
    });
    it('Should go back to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });
    it('Should click on edit current address', () => {
        PageObjects.YouOrders.clickOnEditCurrentAddressIcon();
    });
    it('Should fill in address info', () => {
        PageObjects.YouOrders.addShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA.NAME, 
            CONSTANT.SHIPPING.SHIPPING_DATA.CITY,
            CONSTANT.SHIPPING.SHIPPING_DATA.STATE,
            CONSTANT.SHIPPING.SHIPPING_DATA.POSTAL,
            CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS);
    });
    it('Should click on cancel btn', () => {
        PageObjects.YouOrders.clickOnCancelBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
    });
    it('Should click on yes btn from pop up', () => {
        PageObjects.YouOrders.clickOnYesFromPopUp();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
    });
    it('Should go back to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    it('Should click on update shipping shipping address option', () => {
        PageObjects.YouOrders.clickOnUpdateShippingAddress();
    });
    it('Should go to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });

    it('Should click on edit current address', () => {
        PageObjects.YouOrders.clickOnEditCurrentAddressIcon();
    });
    it('Should fill in address info', () => {
        PageObjects.YouOrders.addShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA.NAME, 
            CONSTANT.SHIPPING.SHIPPING_DATA.CITY,
            CONSTANT.SHIPPING.SHIPPING_DATA.STATE,
            CONSTANT.SHIPPING.SHIPPING_DATA.POSTAL,
            CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS);
    });
    it('Should click on update btn', () => {
        PageObjects.YouOrders.clickOnUpdateBtn();
    });
    it('Should click on use verified address from pop up', () => {
        PageObjects.ShippingPage.chooseVerifiedAddress();
    });
    it('Should click on done btn', () => {
        PageObjects.YouOrders.clickOnUpdateBtn();
    });
    it('Should go back to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should go to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should click on report an issue', () => {
        PageObjects.YouOrders.clickOnReportAnIssue();
    });
    it('Should go to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    it('Should click on update shipping shipping address option', () => {
        PageObjects.YouOrders.clickOnUpdateShippingAddress();
    });
    it('Should go to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });
    it('Should click on edit shipping address', () => {
        PageObjects.YouOrders.clickOnEditShippingAddress();
    });
    it('Should fill in address info', () => {
        PageObjects.YouOrders.addShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA.NAME, 
            CONSTANT.SHIPPING.SHIPPING_DATA.CITY,
            CONSTANT.SHIPPING.SHIPPING_DATA.STATE,
            CONSTANT.SHIPPING.SHIPPING_DATA.POSTAL,
            CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS);
    });
    it('Should click on cancel btn', () => {
        PageObjects.YouOrders.clickOnCancelBtn();
    });
    it('Should click on yes btn from pop up', () => {
        PageObjects.YouOrders.clickOnYesFromPopUp();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
    });
    it('Should go back to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    it('Should click on update shipping shipping address option', () => {
        PageObjects.YouOrders.clickOnUpdateShippingAddress();
    });
    it('Should go to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });
    it('Should click on show more', () => {
        PageObjects.YouOrders.clickOnShowMoreOrLess();
    });
    it('Should click on show less', () => {
        PageObjects.YouOrders.clickOnShowMoreOrLess();
    });
   
});
