import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Verify new ACP user with app ID with status complete - log in', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on sign in from the header', () => {
        PageObjects.HomePage.clickOnSignIn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.EMPTY_ACCOUNT.EMAIL, CONSTANT.ACCESS.TEST15_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary ', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
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
    it(`Should assert that we were redirected to the first step of deciding whether we have an ACP APP ID or not`, () => {
        cy.get('[data-cy="id-decision"]').should('have.text','Do you have an ACP application ID?');
    });
    it(`Should click on yes radio button`, () => {
        PageObjects.Acp.checkYesRadioBtn();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it(`Should assert that we were redirected to the personal info form step`, () => {
        cy.get('[data-cy="personalInfoHeade"]').should('have.text','Please provide the following information to verify your application!');
    });
    // fill in valid info
    it(`Should fill in ACP app ID`, () => {
        PageObjects.Acp.fillInACPAppID(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_COMPLETE.APP_ID);
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_COMPLETE.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITH_ID_COMPLETE.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('09', { force: true }).should('have.value', '09');
        cy.get('select').eq(1).select('19', { force: true }).should('have.value', '19');
        cy.get('select').eq(2).select('1983', { force: true }).should('have.value', '1983');
    });
    it(`Should fill in state`, () => {
        PageObjects.Acp.fillInState(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_COMPLETE.STATE);
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_COMPLETE.EMAIL);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert going to the Customer Notice and Agreement step`, () => {
        cy.get('[data-cy="agreementHeader"]').should('have.text','Customer Notice and Agreement');
    });
    it(`Should assert that the signature fields exist and empty`, () => {
        cy.get('[data-cy="firstCheck"]').should('be.empty');
        cy.get('[data-cy="secondCheck"]').should('be.empty');
        cy.get('[data-cy="thirdCheck"]').should('be.empty');
        cy.get('[data-cy="forthCheck"]').should('be.empty');
    });
    it(`Should fill in signatures`, () => {
        PageObjects.Acp.completeAPPSignature();
    });
    it('Should handle the recaptcha here', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it(`Should fill in full name`, () => {
        PageObjects.Acp.fillInFullName('travis sparks');
    });
    it(`Should click on submit btn`, () => {
        PageObjects.Acp.clickOnSubmitBtn();
    });
    it(`Should assert that the app is complete`, () => {
        cy.get('[data-cy="congratsMsg"]').should('have.text', 'Congratulations!');
    });
    it('Should click on shop menu btn from the header', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans from the dropdown menu', () => {
        PageObjects.HomePage.clickOnPlans();
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
    it(`Should assert that the app is complete`, () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        cy.get('[data-cy="congratsMsg"]').should('have.text', 'Congratulations!');
    });
});