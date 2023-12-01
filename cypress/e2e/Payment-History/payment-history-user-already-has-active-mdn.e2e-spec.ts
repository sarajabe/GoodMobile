import { CONSTANT } from '../../fixtures/constants/index';
import { PageObjects } from '../../support/pageObjects/index';

describe('Sign in with a user that already has active mdn then go to payment history page', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin2();
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
        cy.get('[data-cy="viewReceiptBtn"]').last().click();
    });
    it('Should go to receipt page', () => {
        PageObjects.TitleExpectations.goToReceiptDetailsPage();
    });
    it('Should assert order receipt page title', () => {
        cy.get('[data-cy="orderReciptPageTitle"]').should('have.text','Order Reciept');
    });
})