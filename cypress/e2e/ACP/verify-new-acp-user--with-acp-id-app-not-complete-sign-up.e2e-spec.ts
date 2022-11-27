import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Verify new ACP user with app ID with status not complete - sign up', () => {
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
    it(`Should leave fields empty and click on next`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert the required validation messages`, () => {
        cy.get('[data-cy="required-applicationId-msg"]').should('have.text',' Application ID is required ');
        cy.get('[data-cy="required-fname-msg"]').should('have.text',' First name is required ');
        cy.get('[data-cy="required-lname-msg"]').should('have.text',' Last name is required ');
        cy.get('[data-cy="required-state-msg"]').should('have.text',' State is required ');
        cy.get('[data-cy="required-email-msg"]').should('have.text',' Email Address is required ');

    });
    it(`Should fill in invalid ACP app ID`, () => {
        PageObjects.Acp.fillInACPAppID(CONSTANT.ACP_DATA.INVALID_ACP_DATA.APP_ID);
    });
    it(`Should fill in invalid personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.INVALID_ACP_DATA.FIRST_NAME,
            CONSTANT.ACP_DATA.INVALID_ACP_DATA.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('01', { force: true }).should('have.value', '01');
        cy.get('select').eq(1).select('19', { force: true }).should('have.value', '19');
        cy.get('select').eq(2).select('1991', { force: true }).should('have.value', '1991');
    });
    it(`Should fill in state`, () => {
        PageObjects.Acp.fillInState(CONSTANT.ACP_DATA.INVALID_ACP_DATA.STATE);
    });
    it(`Should fill in invalid email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.INVALID_EMAILS.EMAIL1);
    });
    it(`Should assert the invalid validation messages`, () => {
        cy.get('[data-cy="invalid-applicationId-msg"]').should('have.text',' Application ID is invalid ');
        cy.get('[data-cy="invalid-fname-msg"]').should('have.text',' First name is invalid ');
        cy.get('[data-cy="invalid-lname-msg"]').should('have.text',' Last name is invalid ');
        cy.get('[data-cy="invalid-state-msg"]').should('have.text',' State is invalid ');
        cy.get('[data-cy="invalid-email-msg"]').should('have.text',' Email Address is invalid ');
    });
    it(`Should fill in invalid email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.INVALID_EMAILS.EMAIL2);
    });
    it(`Should assert the invalid email messages`, () => {
        cy.get('[data-cy="invalid-email-msg"]').should('have.text',' Email Address is invalid ');
    });
    it(`Should fill in invalid email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.INVALID_EMAILS.EMAIL3);
    });
    it(`Should assert the invalid email messages`, () => {
        cy.get('[data-cy="invalid-email-msg"]').should('have.text',' Email Address is invalid ');
    });
    it(`Should fill in invalid email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.INVALID_EMAILS.EMAIL4);
    });
    it(`Should assert the invalid email messages`, () => {
        cy.get('[data-cy="invalid-email-msg"]').should('have.text',' Email Address is invalid ');
    });
    it(`Should leave fields empty and click on next`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should stay in the personal info form step`, () => {
        cy.get('[data-cy="personalInfoHeade"]').should('have.text','Please provide the following information to verify your application!');
    });
    // fill in valid info
    it(`Should fill in ACP app ID`, () => {
        PageObjects.Acp.fillInACPAppID(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.APP_ID);
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('01', { force: true }).should('have.value', '01');
        cy.get('select').eq(1).select('19', { force: true }).should('have.value', '19');
        cy.get('select').eq(2).select('1991', { force: true }).should('have.value', '1991');
    });
    it(`Should fill in state`, () => {
        PageObjects.Acp.fillInState(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.STATE);
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.EMAIL);
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
    it(`Should fill in signutures`, () => {
        PageObjects.Acp.NotCompleteAPPSignature();
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should assert that we were redirected to the personal info form step`, () => {
        cy.get('[data-cy="personalInfoHeade"]').should('have.text','Please provide the following information to verify your application!');
    });
    it(`Should assert that the fields are filled`, () => {
        cy.get('[data-cy="applicationId"]').should('have.value', 'B77527-80681');
        cy.get('[data-cy="firstName"]').should('have.value', 'Maria');
        cy.get('[data-cy="lastName"]').should('have.value', 'Yool');
        cy.get('[data-cy="state"]').should('have.value', 'ME');
        cy.get('[data-cy="email"]').should('have.value', 'lara.khoury@pavocom.com');
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should assert that the radio yes radio is checked`, () => {
        cy.get('#yes').should('be.checked');
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert that we were redirected to the personal info form step`, () => {
        cy.get('[data-cy="personalInfoHeade"]').should('have.text','Please provide the following information to verify your application!');
    });
    it(`Should fill in ACP app ID`, () => {
        PageObjects.Acp.fillInACPAppID(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.APP_ID);
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('01', { force: true }).should('have.value', '01');
        cy.get('select').eq(1).select('19', { force: true }).should('have.value', '19');
        cy.get('select').eq(2).select('1991', { force: true }).should('have.value', '1991');
    });
    it(`Should fill in state`, () => {
        PageObjects.Acp.fillInState(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.STATE);
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.EMAIL);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page - signatures section', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
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
        PageObjects.Acp.NotCompleteAPPSignature();
    });
    it('Should handle the recaptcha here', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it(`Should fill in full name`, () => {
        PageObjects.Acp.fillInFullName('Maria Yool');
    });
    it(`Should click on submit btn`, () => {
        PageObjects.Acp.clickOnSubmitBtn();
    });
    it(`Should assert that the app is not complete`, () => {
        cy.get('[data-cy="acpAPPNotComplete"]').should('have.text', ' It seems like you have not completed your ACP application with the National Verifier yet.');
    });
});