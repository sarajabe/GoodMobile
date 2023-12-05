import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,view invoice', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders();
    });
    it('Should go to your orders page', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on order details', () => {
        PageObjects.YouOrders.clickOnNeedHelp();
    });
    it('Should go to FAQs page', () => {
        PageObjects.TitleExpectations.goToFaqsPage();
    });
});
