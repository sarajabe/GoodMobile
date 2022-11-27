import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'

describe('remove phone from cart - cancel and keep phoe', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST2_ACCOUNT.EMAIL, CONSTANT.ACCESS.TEST2_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on phones', () => {
        PageObjects.HomePage.clickOnPurchasePhone();
    });
    it('Should go to phones page', () => {
        PageObjects.TitleExpectations.goToPhonesPage();
    });
    it('Should click on shop iphone', () => {
        PageObjects.PurchasedPhones.clickOnShopIphonePhones();
    });
    it('Should go to phones models page', () => {
        PageObjects.TitleExpectations.goToPhoneModelPage();
    });
    it('Should select 2nd phone', () => {
        PageObjects.PurchasedPhones.clickOnSelect3rdPhone();
    });
    it('Should go to phones phone details page', () => {
        PageObjects.TitleExpectations.goToPhoneDetailsPage();
    });
    it('Should select gray', () => {
        PageObjects.PurchasedPhones.clickOnXSGray();
    });
    it('Should select phone btn', () => {
        PageObjects.PurchasedPhones.clickOnSelecPhoneBtn();
    });
    it('Should go to select line page', () => {
        PageObjects.TitleExpectations.goToSelectLinePage();
    });
    it('Should click on current mobile number', () => {
        PageObjects.PurchasedPhones.clickOnCurrentMobileNumber();
    });
    it('Should select a tmo mdn from the dropdown list ', () => {
        cy.get('select').eq(1).select('(214) 517-1499', { force: true }).should('have.value', '0: Object');
    });
    it('Should click on next', () => {
        PageObjects.PurchasedPhones.clickOnNextBtn();
    });
    it('Should go to Service Coverage Check page', () => {
        PageObjects.TitleExpectations.goToServiceCoverageCheckPage();
    });
    it('Should click on done btn', () => {
        PageObjects.PurchasedPhones.clickOnDoneBtn();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should the phone model,price, quantity from the order details', () => {
        cy.get('.phone-name').should('have.text', 'iPhone XS 64GB Silver');
        cy.get('.head-desc > :nth-child(2)').should('have.text', '$450.00');
        cy.get('.phones-section > :nth-child(1) > .quantity').should('have.text', 'Quantity: 1');
    });
    it('Should remove phone from cart', () => {
        PageObjects.PurchasedPhones.removePhoneFromCart();
    });
    it('Should click on cancel from pop up', () => {
        PageObjects.ShippingPage.clickOnCancelBtnFromRemoveitemPopUp();
    });
    it('Should stay in shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should click on remove plan from cart', () => {
        PageObjects.ShippingPage.clickOnRemoveOrder();
    });
    it('Should click yes btn from pop up ', () => {
        PageObjects.ShippingPage.clickOnYesBtnFromRemoveitemPopUp();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
});

