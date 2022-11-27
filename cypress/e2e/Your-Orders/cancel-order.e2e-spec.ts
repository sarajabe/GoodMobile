import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,to cancel an order', () => {
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
    it('Should click on cancel btn', () => {
        PageObjects.YouOrders.clickOnCancel();
    });
    it('Should click on no from the pop up', () => {
        PageObjects.YouOrders.clickOnNoBtnFromCancelOrderPopUp();
    });
    it('Should go back to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
});
