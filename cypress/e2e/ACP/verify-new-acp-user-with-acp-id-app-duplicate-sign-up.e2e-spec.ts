import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Verify new ACP user with app ID with status duplicate - sign up', () => {
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
    it('Should go to sign up page', () => {
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
        PageObjects.Acp.fillInACPAppID(CONSTANT.ACP_DATA.DUPLICATE_APP.APP_ID);
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.DUPLICATE_APP.FIRST_NAME,
            CONSTANT.ACP_DATA.DUPLICATE_APP.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('01', { force: true }).should('have.value', '01');
        cy.get('select').eq(1).select('01', { force: true }).should('have.value', '01');
        cy.get('select').eq(2).select('2001', { force: true }).should('have.value', '2001');
    });
    it(`Should fill in state`, () => {
        PageObjects.Acp.fillInState(CONSTANT.ACP_DATA.DUPLICATE_APP.STATE);
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.DUPLICATE_APP.EMAIL);
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
        PageObjects.Acp.duplicateAPPSignature();
    });
    it('Should handle the recaptcha here', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it(`Should fill in full name`, () => {
        PageObjects.Acp.fillInFullName('duplicate account');
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
    it(`Should assert that we were redirected to the first step of deciding whether we have an ACP APP ID or not`, () => {
        cy.get('[data-cy="id-decision"]').should('have.text','Do you have an ACP application ID?');
    });
    
});