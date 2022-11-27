import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Select new plan with a full cart - not logged in', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select a plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on I already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it('Should go check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number and address reference', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_ATT);
        PageObjects.Compatibility.enterAddressRef();
        cy.get('[data-cy=equipmentNumber]').click();
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check phone button', () => {
        PageObjects.Compatibility.clickOnCheckPhoneButton();
    });
    it('Should go  compatibility result page', () => {
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
    });
    it('Should click on proceed to checkout button', () => {
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
    });
    it('Should go to checkout new customer page and assert the plan to be 1GB', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.get(':nth-child(3) > .plan-details > :nth-child(1) > .title').should('have.text', '1GB 4G LTE');
    });
    it('Should click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select another plan', () => {
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
    });
    it('Should go to checkout new customer page and assert that the plan was changed from 1GB to 2GB', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.get(':nth-child(3) > .plan-details > :nth-child(1) > .title').should('have.text', '2GB 4G LTE');
    });
    it('Should click on remove plan from cart', () => {
        PageObjects.ShippingPage.clickOnRemoveOrder();
    });
    it('Should click yes btn from pop up ', () => {
        PageObjects.ShippingPage.clickOnYesBtnFromRemoveitemPopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
});

