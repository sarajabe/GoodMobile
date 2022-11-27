import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign up - invalid/required/mismatched passwords & already exist user cases', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on sign in', () => {
        PageObjects.HomePage.clickOnSignIn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should click on sign up link', () => {
        PageObjects.AccessControl.clickOnSignUpLink();
    });
    it('Should go to the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
    });
    it('Should leave customer`s info empty', () => {
        cy.get('[data-cy=firstName]').click();
        cy.get('[data-cy=firstName]').clear();
        cy.get('[data-cy=lastName]').click();
        cy.get('[data-cy=lastName]').clear();
        cy.get('[data-cy=email]').click();
        cy.get('[data-cy=email]').clear();
        cy.get('[data-cy=password]').click();
        cy.get('[data-cy=password]').clear();
        cy.get('[data-cy=confirmPassword]').click();
        cy.get('[data-cy=confirmPassword]').clear();
    });
    it('Should assert the required fields validation message', () => {
        cy.get('[data-cy="firstNameRequiredMsg"]').should('have.text', ' First name is required ');
        cy.get('[data-cy="lastNameRequiredMsg"]').should('have.text', ' Last name is required ');
        cy.get('[data-cy="required-email-msg"]').should('have.text', ' Email address is required. ');
        cy.get('[data-cy="passRequireddMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit button', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should stay in the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
        cy.reload(true);
    });
    it('Should insert invalid customer info -> names as numbers, email:missin the sub-domain/top-level domain, passwords:only numbers)', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.INVALID_SIGN_UP_DATA1.FIRST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA1.LAST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA1.EMAIL,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA1.PASSWORD,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA1.CONFIRMED_PASS);
    });
    it('Should assert the invalid fields validation message', () => {
        cy.get('[data-cy="invalidFirstNameMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="invalidLastNameMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="nvalidEmailMsg"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="passRequireddMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit button', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should stay in the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
        cy.reload(true);
    });
    it('Should insert invalid customer info -> names as numbers, email:missing the domain, passwords:only numbers)', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.INVALID_SIGN_UP_DATA2.FIRST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA2.LAST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA2.EMAIL,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA2.PASSWORD,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA2.CONFIRMED_PASS);
    });
    it('Should assert the invalid fields validation message', () => {
        cy.get('[data-cy="invalidFirstNameMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="invalidLastNameMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="nvalidEmailMsg"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="passRequireddMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit button', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should stay in the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
        cy.reload(true);
    });
    it('Should insert invalid customer info -> names as numbers, email:missing the recepient name, passwords:only numbers)', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.INVALID_SIGN_UP_DATA3.FIRST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA3.LAST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA3.EMAIL,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA3.PASSWORD,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA3.CONFIRMED_PASS);
    });
    it('Should assert the invalid fields validation message', () => {
        cy.get('[data-cy="invalidFirstNameMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="invalidLastNameMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="nvalidEmailMsg"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="passRequireddMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit button', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should stay in the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
        cy.reload(true);
    });
    it('Should insert invalid info for the new customer - names have special characters', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.INVALID_SIGN_UP_DATA5.FIRST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA5.LAST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA5.EMAIL,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA5.PASSWORD,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA5.CONFIRMED_PASS);
    });
    it('Should assert the invalid fields validation message', () => {
        cy.get('[data-cy="invalidFirstNameMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="invalidLastNameMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="nvalidEmailMsg"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="passRequireddMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit button', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should stay in the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
        cy.reload(true);
    });
    it('Should insert invalid info for the new customer - names have numbers', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.INVALID_SIGN_UP_DATA6.FIRST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA6.LAST_NAME,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA6.EMAIL,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA6.PASSWORD,
            CONSTANT.ACCESS.INVALID_SIGN_UP_DATA6.CONFIRMED_PASS);
    });
    it('Should assert the invalid fields validation message', () => {
        cy.get('[data-cy="invalidFirstNameMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="invalidLastNameMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="nvalidEmailMsg"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="passRequireddMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit button', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should stay in the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
        cy.reload(true);
    });
    it('Should insert invalid info & mismatched passwords for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.MISMATCHED_PASS.FIRST_NAME,
            CONSTANT.ACCESS.MISMATCHED_PASS.LAST_NAME,
            CONSTANT.ACCESS.MISMATCHED_PASS.EMAIL,
            CONSTANT.ACCESS.MISMATCHED_PASS.PASSWORD,
            CONSTANT.ACCESS.MISMATCHED_PASS.CONFIRMED_PASS);
    });
    it('Should assert the invalid fields validation message', () => {
        cy.get('[data-cy="invalidFirstNameMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="invalidLastNameMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="nvalidEmailMsg"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="passRequireddMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
        cy.get('[data-cy="mismatchedPassMsg"]').should('have.text', ' Passwords do not match ');
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit button', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should stay in the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
        cy.reload(true);
    });
    it('Should insert already existing customer info', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.EXISTING_CUSTOMER.FIRST_NAME,
            CONSTANT.ACCESS.EXISTING_CUSTOMER.LAST_NAME,
            CONSTANT.ACCESS.EXISTING_CUSTOMER.EMAIL,
            CONSTANT.ACCESS.EXISTING_CUSTOMER.PASSWORD,
            CONSTANT.ACCESS.EXISTING_CUSTOMER.CONFIRMED_PASS);
    });
    it('Should assert the invalid fields validation message', () => {
        cy.get('[data-cy="firstNameRequiredMsg"]').should('not.exist');
        cy.get('[data-cy="lastNameRequiredMsg"]').should('not.exist');
        cy.get('[data-cy="required-email-msg"]').should('not.exist');
        cy.get('[data-cy="passRequireddMsg"]').should('not.exist');
        cy.get('[data-cy="invalidFirstNameMsg"]').should('not.exist');
        cy.get('[data-cy="invalidLastNameMsg"]').should('not.exist');
        cy.get('[data-cy="nvalidEmailMsg"]').should('not.exist');
        cy.get('[data-cy="passRequireddMsg"]').should('not.exist');
        cy.get('[data-cy="mismatchedPassMsg"]').should('not.exist');
        cy.get('[data-cy=firstName]').should('exist');
        cy.get('[data-cy=lastName]').should('exist');
        cy.get('[data-cy=email]').should('exist');
        cy.get('[data-cy=password]').should('exist');
        cy.get('[data-cy=confirmPassword]').should('exist');
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit button', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should stay in the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
    });

});
