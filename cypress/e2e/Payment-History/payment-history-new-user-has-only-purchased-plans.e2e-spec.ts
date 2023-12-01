
import { PageObjects } from '../../support/pageObjects'

describe('SignUp -  Shop new plan from plans page with home delivery', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should signUp successfully', () => {
        PageObjects.AccessControl.newUser();
    });
    it('Should click on payment history from navbar', () => {
        PageObjects.HomePage.clickOnPaymentHistory();
    });
    it('Should go to the payment history page', () => {
        PageObjects.TitleExpectations.goToPaymentHistoryPage();
    });
    it('Should go to the payment history page', () => {
        cy.get('[data-cy="noActiveMdnMsg"]').should('have.text','You have no active phone number at the moment.');
        cy.go('back');
    });
    it('Should 2GB purchase plan for new user with home delivery', () => {
        PageObjects.PurchasedPlans.purchase2GBPlanWithHomeDeliveryNewUser();
    });
    it('Should assert purchased 2GB plan with home delivery', () => {
        PageObjects.PurchasedPlans.assertPurchased2GBPlanWithHomeDelivery();
    });
    it('Should click on payment history from navbar', () => {
        PageObjects.AccountSummary.clickOnPaymentHistory();
    });
    it('Should go to the payment history page', () => {
        PageObjects.TitleExpectations.goToPaymentHistoryPage();
    });
    it('Should assert payment history detials', () => {
        cy.get('[data-cy="paymentHistoryTitle"]').should('have.text','Your payment history');
        cy.get('[data-cy="paymentDate"]').should('exist');
        cy.get('[data-cy="status"]').should('exist');   
        cy.get('[data-cy="paymentMethod"]').should('exist');
        cy.get('[data-cy="confirmationNumber"]').should('exist');
        cy.get('[data-cy="amount"]').should('exist');
    });
    it('Should click on view receipt btn', () => {
        cy.get('[data-cy="viewReceiptBtn"]').eq(0).click();
    });
    it('Should go to receipt page', () => {
        PageObjects.TitleExpectations.goToReceiptDetailsPage();
    });
    it('Should assert order receipt page title', () => {
        cy.get('[data-cy="orderReciptPageTitle"]').should('have.text','Order Reciept');
        cy.get('[data-cy="itemName"]').eq(0).should('have.text','Unlimited Talk & text with 2GB Data');
        cy.get('[data-cy="itemPrice"]').eq(0).should('have.text','$10.00');
        cy.get('[data-cy="total"]').should('have.text','Total:$13.06');
    });
})