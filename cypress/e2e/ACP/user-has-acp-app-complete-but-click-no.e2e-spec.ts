import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then enroll in ACP plan -', () => {
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
    it(`Should fill in personal info - first name and last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.LAST_NAME);
    });
    it('Should fill in birth month', () => {
        cy.get('select').eq(0).select('09', { force: true }).should('have.value', '09');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
        cy.get('select').eq(1).select('19', { force: true }).should('have.value', '19');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);

    });
    it(`Should fill in personal info - birth day and year`, () => {
        PageObjects.Acp.fillInPersonalInfoPart2(
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.YOB);
    });
    it('Should click on ID type SSN', () => {
        cy.get('select').eq(2).select('Tribal ID', { force: true }).should('have.value', 'tribal');
    });
    it(`Should fill in the ssn`, () => {
        PageObjects.Acp.fillITribalID(
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.TRIBAL_ID);
    });
    it(`Should fill in the email`, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.EMAIL);
    });
    it('Should click on Next btn ', () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should stay in acp page - and move to step two to chose the qualifying program', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
        cy.get('.step-title').should('have.text', 'Qualified Programs');
    });
    it('Should chose 4 qualifying programs', () => {
        cy.get('li').eq(20).click({ force: true });
        cy.get('li').eq(21).click({ force: true });
        cy.get('li').eq(22).click({ force: true });
    });
    it('Should fill in school name', () => {
        PageObjects.Acp.fillInSchoolName();
    });
    it('Should click on Next btn- move to step 3', () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should stay in acp page - and move to step 3 to fill in address', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
        cy.get('.step-title').should('have.text', 'Addresses Information');
    });
    // fill in valid address info
    it(`Should fill in address info`, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.ADDRESS1,
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.CITY);
    });
    it(`Should fill in address info - the state and the zip`, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo2(
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.STATE,
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.ZIP_CODE);
    });
    it(`Should fill in maling address info - the address line and the city`, () => {
        PageObjects.Acp.fillInMailingAddress(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.ADDRESS1,
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.CITY);
    });
    it(`Should fill in maling address info - the state and the zip code`, () => {
        PageObjects.Acp.fillInMailingAddress2(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.STATE,
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.ZIP_CODE);
    });
    it('Should check that the verify btn is enabled', () => {
        cy.get('[data-cy="verifyBtn"]').should('not.be.disabled');
    });
    it('Should stay in ACP - validate page ', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it('Should click on Next btn- move to step 3 to fill in the signatures', () => {
        PageObjects.Acp.clickOnVerifyBtn();
    });
    it('Should stay in ACP - validate page - and go to the signature section', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
        cy.get('.step-title').should('have.text', 'Customer Notice and Agreement');
    });
    it(`Should fill in signutures`, () => {
        PageObjects.Acp.completeAPPSignature();
    });
    it(`Should fill in full name`, () => {
        PageObjects.Acp.fillInFullName(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.FULL_NAME);
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo1();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it(`Should click on submit btn`, () => {
        PageObjects.Acp.clickOnSubmitBtn();
    });
    it(`Should assert that the app is duplicate`, () => {
        cy.get('.message').should('have.text', 'An application with these details has already been filed using another Good2Go account. Please contact customer care for more help.');
    });
    it(`Should click on got it btn from the pop up`, () => {
        PageObjects.Acp.clickOnGotItBtnFromPopUp();
    });
});
