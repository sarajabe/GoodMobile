import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants/index';
class AccessControl {
        signUp(firstName, lastName, email, password, confirmPassword) {
                cy.get('[data-cy="firstName"]').clear();
                cy.get('[data-cy="lastName"]').clear();
                cy.get('[data-cy="email"]').clear();
                cy.get('[data-cy="password"]').clear();
                cy.get('[data-cy="confirmPassword"]').clear();
                cy.get('[data-cy="firstName"]').type(firstName);
                cy.get('[data-cy="lastName"]').type(lastName);
                cy.get('[data-cy="email"]').type(email);
                cy.get('[data-cy="password"]').type(password);
                cy.get('[data-cy="confirmPassword"]').type(confirmPassword);
                return this;
        };
        existingCustomerLogin(email, password) {
                cy.get('[data-cy=loginEmail]').clear();
                cy.get('[data-cy=loginEmail]').type(email);
                cy.get('[data-cy=loginPassword]').clear();
                cy.get('[data-cy=loginPassword]').type(password);
                cy.get('#login-button').click();
                return this;
        };
        logIn(email, password) {
                cy.get('[data-cy="loginEmail"]').clear();
                cy.get('[data-cy="loginEmail"]').type(email);
                cy.get('[data-cy="loginPassword"]').clear();
                cy.get('[data-cy="loginPassword"]').type(password);
                return this;
        };
        logInButton(){
                cy.get('[data-cy="sign-in-button"]').click();
                return this;
        };
        clickOnSignUpLink(){
                cy.get('[data-cy="signup-link"]').click();
                return this;
        };
        signUpClick() {
                cy.get('[data-cy="continueSignUpBtn"]').click();
                return this;
        };
        clickOnSubmitBtn() {
                cy.get('[data-cy="submitBtn"]').click();
                return this;
        };
        logoutFromAccount() {
                cy.get('[data-cy="account-menu-header"]').click({force: true});
                cy.get('[data-cy="logout-header"]').click({force: true});
                cy.title().should('eq','FREE Unlimited Cell Phone Plans | Good Mobile');
                return this;
        };
        logoutFromAccountAfterBeingInACPApp() {
                cy.get('[data-cy="account-menu-header"]').click({force: true});
                cy.get('#logout-header').click({force: true});
                cy.title().should('eq','Login To Your Good2Go Mobile Account | Good2Go Mobile');
                return this;
        };
        clickOnContinueSignUpBtn() {
                cy.get('[data-cy="continueSignUpBtn"]').click();
                return this;
        };
        successfulLogin(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST_USER.EMAIL, CONSTANT.ACCESS.TEST_USER.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToAccountSummaryPage();
        };
        noAddOnsOrderAccount(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.LARA_ACCOUNT.EMAIL, CONSTANT.ACCESS.LARA_ACCOUNT.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToAccountSummaryPage();
        };
        accountAlreadyHasAddOnsOrder(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.RANA_PAVO_ACCOUNT.EMAIL, CONSTANT.ACCESS.RANA_PAVO_ACCOUNT.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToAccountSummaryPage();
        };

}
export default new AccessControl();
