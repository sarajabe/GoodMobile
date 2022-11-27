import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then enroll in ACP plan - new user - unrelated state and city', () => {
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
    it('Should click on sign up', () => {
        PageObjects.HomePage.clickOnSignUp();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
    });
    it('Should insert valid info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA2.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.CONFIRMED_PASS);
    });
    it('Should check the reCaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo1();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should go to welcome on board page', () => {
        PageObjects.TitleExpectations.goToWelcomeOnBoardPage();
    });
    it('Should click on shop plans btn', () => {
        PageObjects.welcomeOnBoard.clickOnShopPlansBtn();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should click on learn more btn', () => {
        PageObjects.Acp.clickOnLearnMoreBtn();
    });
    it('Should go to ACP page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on apply now button', () => {
        PageObjects.Acp.clickOnApplyNowBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it(`Should check the No radio btn`, () => {
        PageObjects.Acp.checkNoRadioBtn();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to ACP - validate page', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it(`Should go to personal info form`, () => {
        cy.get('.step-title').should('have.text', 'Personal Information');
    });
    it(`Should fill in personal info - first name and last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.PERSONAL_INFO.FIRST_NAME,
            CONSTANT.ACP_DATA.PERSONAL_INFO.LAST_NAME);
    });
    it('Should click on birth month and day', () => {
        cy.get('select').eq(0).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(1).select('06', { force: true }).should('have.value', '06');
    });
    it(`Should fill in personal info - min invalid birth year`, () => {
        PageObjects.Acp.fillInPersonalInfoPart2(
            CONSTANT.ACP_DATA.PERSONAL_INFO.MIN_YEAR_INVALID);
    });
    it(`Should assert that the year is invalid`, () => {
        cy.get('[data-cy="yearInvalidMsg"]').should('have.text', ' Year is invalid ');
    });
    it(`Should fill in personal info - max invalid birth year`, () => {
        var date = new Date();
        var year = date.getFullYear();
        PageObjects.Acp.fillInPersonalInfoPart2(year+1);
    });
    it(`Should assert that the max year is invalid`, () => {
        cy.get('[data-cy="yearInvalidMsg"]').should('have.text', ' Year is invalid ');

    });
});
