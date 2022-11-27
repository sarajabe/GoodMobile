import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Login - Invalid/Required & doe not exist cases', () => {
     before(() => {
          PageObjects.BeforeAll.executeBeforeAll();
     });
     it('Should click on sign in', () => {
          PageObjects.HomePage.clickOnSignIn();
     });
     it('Should go to login page', () => {
          PageObjects.TitleExpectations.goToLogInPage();
     });
     it('Should leave fielde empty', () => {
          cy.get('[data-cy=loginEmail]').click();
          cy.get('[data-cy=loginEmail]').clear();
          cy.get('[data-cy="loginPassword"]').clear();
          cy.get('[data-cy="loginPassword"]').click();
     });
     it('Should assert that the sign in button is disabled', () => {
          cy.get('[data-cy=sign-in-button]').should('be.disabled');
     });
     it('SShould fill login form with invalid email - case 1', () => {
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.INVALID_CREDENTIALS1.EMAIL, CONSTANT.ACCESS.INVALID_CREDENTIALS1.PASSWORD);
     });
     it('Should assert the invalid email validation msg', () => {
          cy.get('[data-cy="invalidEmailMsg"]').should('have.text',' Please enter a valid email ');
     });
     it('Should assert that the sign in button is disabled', () => {
          cy.get('[data-cy=sign-in-button]').should('be.disabled');
     });
     it('Should fill login form with invalid email - case 2', () => {
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.INVALID_CREDENTIALS2.EMAIL, CONSTANT.ACCESS.INVALID_CREDENTIALS2.PASSWORD);
     });
     it('Should assert the invalid email validation msg', () => {
          cy.get('[data-cy="invalidEmailMsg"]').should('have.text',' Please enter a valid email ');
     });
     it('Should assert that the sign in button is disabled', () => {
          cy.get('[data-cy=sign-in-button]').should('be.disabled');
     });
     it('Should fill login form with invalid email - case 3', () => {
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.INVALID_CREDENTIALS3.EMAIL, CONSTANT.ACCESS.INVALID_CREDENTIALS3.PASSWORD);
     });
     it('Should assert the invalid email validation msg', () => {
          cy.get('[data-cy="invalidEmailMsg"]').should('have.text',' Please enter a valid email ');
     });
     it('Should assert that the sign in button is disabled', () => {
          cy.get('[data-cy=sign-in-button]').should('be.disabled');
     });
     it('Should fill login form with invalid email - case 4', () => {
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.INVALID_CREDENTIALS4.EMAIL, CONSTANT.ACCESS.INVALID_CREDENTIALS4.PASSWORD);
     });
     it('Should assert the invalid email validation msg', () => {
          cy.get('[data-cy="invalidEmailMsg"]').should('have.text',' Please enter a valid email ');
     });
     it('Should assert that the sign in button is disabled', () => {
          cy.get('[data-cy=sign-in-button]').should('be.disabled');
     });
     it('Should fill login form with a valid email but doesn`t exist in the system', () => {
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.DOES_NOT_EXIST.EMAIL, CONSTANT.ACCESS.DOES_NOT_EXIST.PASSWORD);
     });
     it('Should click on sign in btn', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should stay in login page', () => {
          PageObjects.TitleExpectations.goToLogInPage();
     });
     it('Should fill login form with a valid existing email and invalid pass', () => {
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.VALID_EMAIL_INVALID_PASS.EMAIL, CONSTANT.ACCESS.VALID_EMAIL_INVALID_PASS.PASSWORD);
     });
     it('Should click on sign in btn', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should stay in login page', () => {
          PageObjects.TitleExpectations.goToLogInPage();
     });
});
