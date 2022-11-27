import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,then the order details page to edit the shipping address', () => {
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
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders6thChild();
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
    it('Should click on change to change the shipping address', () => {
        PageObjects.YouOrders.clickOnChangeAddress();
    });
    it('Should fill in the new shipping address', () => {
        PageObjects.YouOrders.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.NAME,
            CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.SHIPPING_ADDRESS,
            CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.CITY,
            CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.STATE,
            CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should click on save btn', () => {
        PageObjects.YouOrders.clickOnSave();
    });
    it('Should click on use verified address', () => {
        PageObjects.PurchasedPlans.clickOnUseVerifiedAddress();
    });
    it('Should go back to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
});
