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
                Cypress.env('newEmail' , email);
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
                Cypress.env('newEmail' , email);
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
                cy.get('[data-cy="logout-header"]').click({force: true});
                cy.title().should('eq','Login To Your Good Mobile Account | Good Mobile');
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
                cy.get('[data-cy="acpSummary"]').then(($btn) => {
                        if ($btn.hasClass('active')) {
                          cy.get('[data-cy="accountSummary"]').click({force:true});
                          PageObjects.TitleExpectations.goToAccountSummaryPage();
                        } else {
                          PageObjects.TitleExpectations.goToAccountSummaryPage();
                        }
                })
        };
        noAddOnsOrderAccount(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.LARA_ACCOUNT.EMAIL, CONSTANT.ACCESS.LARA_ACCOUNT.PASSWORD);
                PageObjects.AccessControl.logInButton();
                cy.get('[data-cy="accountSummary"]').click({force:true});
                PageObjects.TitleExpectations.goToAccountSummaryPage();
        };
        accountHasCanceledMdn(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.RANA_PAVO_ACCOUNT.EMAIL, CONSTANT.ACCESS.RANA_PAVO_ACCOUNT.PASSWORD);
                PageObjects.AccessControl.logInButton();
                cy.get('[data-cy="accountSummary"]').click({force:true});
                PageObjects.TitleExpectations.goToAccountSummaryPage();
        };
        accountAlreadyHasAddOnsOrder(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST_A_USER.EMAIL, CONSTANT.ACCESS.TEST_A_USER.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToAccountSummaryPage();
        };
        newUser(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.clickOnSignUpLink();
                PageObjects.TitleExpectations.goToSignUpPage();
                PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA.FIRST_NAME,
                        CONSTANT.ACCESS.NEW_SIGNUP_DATA.LAST_NAME,
                        PageObjects.Dynamics.makeNewEmail(),
                        CONSTANT.ACCESS.NEW_SIGNUP_DATA.PASSWORD,
                        CONSTANT.ACCESS.NEW_SIGNUP_DATA.CONFIRMED_PASS);
                PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
                cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
                PageObjects.AccessControl.clickOnSubmitBtn();
        };
        accountAlreadyHasAddOnsOneOrder(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST_A_USER.EMAIL, CONSTANT.ACCESS.TEST_A_USER.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToAccountSummaryPage();
                return this;
        };
        accountAlreadyHasAddOnsMultipleOrder(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.LARA_PAVO_ACCOUNT.EMAIL, CONSTANT.ACCESS.LARA_PAVO_ACCOUNT.PASSWORD);
                PageObjects.AccessControl.logInButton();
                cy.get('[data-cy="accountSummary"]').click({force:true});
                PageObjects.TitleExpectations.goToAccountSummaryPage();
                return this;
        };
        accountAlreadyHasAddOns5OrderOneInternationalCalling(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TESTB_USER.EMAIL, CONSTANT.ACCESS.TESTB_USER.PASSWORD);
                PageObjects.AccessControl.logInButton();
                cy.get('[data-cy="accountSummary"]').click({force:true});
                PageObjects.TitleExpectations.goToAccountSummaryPage();
                return this;
        };
        newUserAcp(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.clickOnSignUpLink();
                PageObjects.TitleExpectations.goToSignUpPage();
                PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA2.FIRST_NAME,
                        CONSTANT.ACCESS.NEW_SIGNUP_DATA2.LAST_NAME,
                        PageObjects.Dynamics.makeNewAcpEmail(),
                        CONSTANT.ACCESS.NEW_SIGNUP_DATA2.PASSWORD,
                        CONSTANT.ACCESS.NEW_SIGNUP_DATA2.CONFIRMED_PASS);
                PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
                cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
                PageObjects.AccessControl.clickOnSubmitBtn();
                cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
                PageObjects.TitleExpectations.goToWelcomeOnBoardPage();
        };
        logInNewUserAcp( password) {
                cy.get('[data-cy="loginEmail"]').clear();
                const newEmail = Cypress.env('newEmail');
                cy.get('[data-cy="loginEmail"]').type(newEmail);
                cy.get('[data-cy="loginPassword"]').clear();
                cy.get('[data-cy="loginPassword"]').type(password);
                return this;
        };
        successfulLoginExisingUserWithMdn(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TESTB_USER.EMAIL, CONSTANT.ACCESS.TESTB_USER.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToAccountSummaryPage();
        };
        successfulLoginNewUserAcp(){
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logInNewUserAcp( CONSTANT.ACCESS.NEW_ACCOUNT.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToACPApplicationPage();
        };
        logInUserWithNoAcp() {
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.ACCOUNT_WITH_NO_ACP.EMAIL, CONSTANT.ACCESS.ACCOUNT_WITH_NO_ACP.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToAccountSummaryPage();
                return this;
        };
        logInUserWithPendingAcpDevice() {
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.ACCOUNT_WITH_PENDING_ACP_DEVICE.EMAIL, CONSTANT.ACCESS.ACCOUNT_WITH_PENDING_ACP_DEVICE.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToACPApplicationPage();
                return this;
        };
        logInUserWithShippedAcpDevice() {
                PageObjects.HomePage.clickOnSignIn();
                PageObjects.TitleExpectations.goToLogInPage();
                PageObjects.AccessControl.logIn(CONSTANT.ACCESS.ACCOUNT_WITH_SHIPPED_ACP_DEVICE.EMAIL, CONSTANT.ACCESS.ACCOUNT_WITH_SHIPPED_ACP_DEVICE.PASSWORD);
                PageObjects.AccessControl.logInButton();
                PageObjects.TitleExpectations.goToACPApplicationPage();
                return this;
        };
}
export default new AccessControl();
