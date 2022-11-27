import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe('Select plan as new customer  invalid/required cases', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on shop menu', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should click on skip for now link ', () => {
        PageObjects.Plans.clickOnSkipForNow();
    });
    it('Should click on yes from skip device popup', () => {
        PageObjects.Plans.clickOnYesSkipDevice();
    });
    it('Should go to checkout new customer', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
    });
    it('Should leave fieds empty', () => {
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
    it('Should assert required fields validation messages', () => {
        cy.get('[data-cy="firstNameReuiredMsg"]').should('have.text', ' First name is required ');
        cy.get('[data-cy="lastNameRequiredMsg"]').should('have.text', ' Last name is required ');
        cy.get('[data-cy="emailIsRequiredMsg"]').should('have.text', ' Email address is required. ');
        cy.get('[data-cy="requiredPasswordMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
    });
    it('Should leave the reCaptcha unchecked and  click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.reload(true);
    });
    it('Should insert invalid info for new customer all numbers for name,email&pass - short pass', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.INVALID_SIGNUP_DATA1.FIRST_NAME,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA1.LAST_NAME,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA1.EMAIL,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA1.PASSWORD,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA1.CONFIRMED_PASS);
    });
    it('Should assert invalid fields validation messages', () => {
        cy.get('[data-cy="firstNmeIsInvalidMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="lastNameIsInvalidMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="emailIsInvalid"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="requiredPasswordMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
    });
    it('Should click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.reload(true);
    });
    it('Should insert invalid info for new customer all numbers for name,pass - short pass- invalid email format', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.INVALID_SIGNUP_DATA.FIRST_NAME,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA.LAST_NAME,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA.EMAIL,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA.PASSWORD,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA.CONFIRMED_PASS);
    });
    it('Should assert invalid fields validation messages', () => {
        cy.get('[data-cy="firstNmeIsInvalidMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="lastNameIsInvalidMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="emailIsInvalid"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="requiredPasswordMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
    });
    it('Should click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.reload(true);
    });
    it('Should insert invalid info for new customer all numbers for name,pass - mismatched pass- invalid email format', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.MISMATCHED_PASS_DATA.FIRST_NAME,
            CONSTANT.ACCESS.MISMATCHED_PASS_DATA.LAST_NAME,
            CONSTANT.ACCESS.MISMATCHED_PASS_DATA.EMAIL,
            CONSTANT.ACCESS.MISMATCHED_PASS_DATA.PASSWORD,
            CONSTANT.ACCESS.MISMATCHED_PASS_DATA.CONFIRMED_PASS);
    });
    it('Should assert invalid fields validation messages', () => {
        cy.get('[data-cy="firstNmeIsInvalidMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="lastNameIsInvalidMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="emailIsInvalid"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="requiredPasswordMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
        cy.get('[data-cy="passwordMismatchMsg"]').should('have.text', ' Passwords do not match ');
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
    });
    it('Should click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer page', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.reload(true);
    });
    it('Should insert invalid first name info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.INVALID_SIGNUP_DATA.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.CONFIRMED_PASS);
    });
    it('Should assert invalid first name field validation messages', () => {
        cy.get('[data-cy="firstNmeIsInvalidMsg"]').should('have.text', ' First name is invalid ');
        cy.get('[data-cy="lastNameIsInvalidMsg"]').should('not.exist');
        cy.get('[data-cy="emailIsInvalid"]').should('not.exist');
        cy.get('[data-cy="requiredPasswordMsg"]').should('not.exist');
        cy.get('[data-cy="passwordMismatchMsg"]').should('not.exist');
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
    });
    it('Should click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer page', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.reload(true);
    });
    it('Should insert invalid last name info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA.FIRST_NAME,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.CONFIRMED_PASS);
    });
    it('Should assert invalid last name field validation messages', () => {
        cy.get('[data-cy="firstNmeIsInvalidMsg"]').should('not.exist');
        cy.get('[data-cy="lastNameIsInvalidMsg"]').should('have.text', ' Last name is invalid ');
        cy.get('[data-cy="emailIsInvalid"]').should('not.exist');
        cy.get('[data-cy="requiredPasswordMsg"]').should('not.exist');
        cy.get('[data-cy="passwordMismatchMsg"]').should('not.exist');
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
    });
    it('Should click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer page', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.reload(true);
    });
    it('Should insert invalid email info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.LAST_NAME,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA.EMAIL,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.CONFIRMED_PASS);
    });
    it('Should assert invalid email field validation messages', () => {
        cy.get('[data-cy="firstNmeIsInvalidMsg"]').should('not.exist');
        cy.get('[data-cy="lastNameIsInvalidMsg"]').should('not.exist');
        cy.get('[data-cy="emailIsInvalid"]').should('have.text', ' Email address is invalid. ');
        cy.get('[data-cy="requiredPasswordMsg"]').should('not.exist');
        cy.get('[data-cy="passwordMismatchMsg"]').should('not.exist');
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
    });
    it('Should click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer page', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.reload(true);
    });
    it('Should insert mismatched pass info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.MISMATCHED_PASS_DATA.PASSWORD,
            CONSTANT.ACCESS.MISMATCHED_PASS_DATA.CONFIRMED_PASS);
    });
    it('Should assert mismatching pass fields validation messages', () => {
        cy.get('[data-cy="firstNmeIsInvalidMsg"]').should('not.exist');
        cy.get('[data-cy="lastNameIsInvalidMsg"]').should('not.exist');
        cy.get('[data-cy="emailIsInvalid"]').should('not.exist');
        cy.get('[data-cy="requiredPasswordMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
        cy.get('[data-cy="passwordMismatchMsg"]').should('have.text', ' Passwords do not match ');
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
    });
    it('Should click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer page', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.reload(true);
    });
    it('Should insert short pass info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA1.PASSWORD,
            CONSTANT.ACCESS.INVALID_SIGNUP_DATA1.CONFIRMED_PASS);
    });
    it('Should assert pass conditions field validation messages', () => {
        cy.get('[data-cy="firstNmeIsInvalidMsg"]').should('not.exist');
        cy.get('[data-cy="lastNameIsInvalidMsg"]').should('not.exist');
        cy.get('[data-cy="emailIsInvalid"]').should('not.exist');
        cy.get('[data-cy="requiredPasswordMsg"]').should('have.text', ' Password must be between 6 and 12 characters with at least one capital letter, one small letter, and one digit. ');
        cy.get('[data-cy="passwordMismatchMsg"]').should('not.exist');
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
    });
    it('Should click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer page', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.reload(true);
    });
    it('Should insert already existing customer data', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.ALREADY_EXISTING_CUSTOMER.FIRST_NAME,
            CONSTANT.ACCESS.ALREADY_EXISTING_CUSTOMER.LAST_NAME,
            CONSTANT.ACCESS.ALREADY_EXISTING_CUSTOMER.EMAIL,
            CONSTANT.ACCESS.ALREADY_EXISTING_CUSTOMER.PASSWORD,
            CONSTANT.ACCESS.ALREADY_EXISTING_CUSTOMER.CONFIRMED_PASS);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on continue button', () => {
        PageObjects.AccessControl.signUpClick();
    });
    it('Should stay in checkout new customer page', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });

});
