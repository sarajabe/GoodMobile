import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,then to report an issue page and click on update address option, edit address', () => {
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
    it('Should click on update shipping address', () => {
        PageObjects.YouOrders.clickOnUpdateShippingAddress();
    });
    it('Should go to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });
    it('Should click on need help', () => {
        PageObjects.YouOrders.clickOnNeedHelpLink();
    });
    it('Should go to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });
    it('Should fill in phone number', () => {
        PageObjects.YouOrders.fillInPhoneNumber(CONSTANT.MDNS.IMPACTED);
    });
    it('Should fill in issue description', () => {
        PageObjects.YouOrders.fillInIssueDescription();
    });
    it('Should click on submit btn', () => {
        PageObjects.YouOrders.clickOnSubmitBtn();
    });
    it('Should go to report confirmation page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
        cy.get('.note-banner > :nth-child(1)').should('have.text', 'Thank you for contacting us.');
    });
    it('Should click on done btn', () => {
        PageObjects.YouOrders.clickOnSubmitBtn();
    });
    it('Should go to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    it('Should click on update shipping address', () => {
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
    it('Should click update btn', () => {
        cy.get('.primary').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on keep current address', () => {
        PageObjects.ShippingPage.chooseKeepCurrentAddress();
    });
    it('Should go back to update shipping Address page', () => {
        PageObjects.TitleExpectations.goToEditOrderAddressPage();
    });
});
