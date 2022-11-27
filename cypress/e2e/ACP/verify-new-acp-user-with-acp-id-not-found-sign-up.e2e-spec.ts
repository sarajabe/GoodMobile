import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Verify new ACP user with app ID with status not found - sign up', () => {
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
    it('Should click on apply now btn', () => {
        PageObjects.Acp.clickOnApplyNowBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it(`Should assert that we were redirected to the first step of deciding whether we have an ACP APP ID or not`, () => {
        cy.get('[data-cy="id-decision"]').should('have.text','Do you have an ACP application ID?');
    });
    it(`Should check the Yes radio btn`, () => {
        PageObjects.Acp.checkYesRadioBtn();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it(`Should stay in the personal info form step`, () => {
        cy.get('[data-cy="personalInfoHeade"]').should('have.text','Please provide the following information to verify your application!');
    });
    it(`Should fill in ACP app ID`, () => {
        PageObjects.Acp.fillInACPAppID(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.APP_ID);
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_FOUND.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_FOUND.LAST_NAME);
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
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_FOUND.EMAIL);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page - signatures section', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
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
    it(`Should assert that the personal info exist`, () => {
      cy.get('[data-cy="firstName"]').should('have.value','Maria');
      cy.get('[data-cy="lastName"]').should('have.value','LL');
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert that the signature fields exist and empty`, () => {
        cy.get('[data-cy="firstCheck"]').should('exist');
        cy.get('[data-cy="firstCheck"]').should('be.empty');
        cy.get('[data-cy="secondCheck"]').should('exist');
        cy.get('[data-cy="secondCheck"]').should('be.empty');
        cy.get('[data-cy="thirdCheck"]').should('exist');
        cy.get('[data-cy="thirdCheck"]').should('be.empty');
        cy.get('[data-cy="forthCheck"]').should('exist');
        cy.get('[data-cy="forthCheck"]').should('be.empty');
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should assert that the yes radio to be checked`, () => {
        cy.get('#yes').should('be.checked');
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should stay in the personal info form step`, () => {
        cy.get('[data-cy="personalInfoHeade"]').should('have.text','Please provide the following information to verify your application!');
    });
    it(`Should fill in ACP app ID`, () => {
        PageObjects.Acp.fillInACPAppID(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_COMPLETE.APP_ID);
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_FOUND.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_FOUND.LAST_NAME);
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
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITH_ID_NOT_FOUND.EMAIL);
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
    it(`Should fill in signutures`, () => {
        PageObjects.Acp.NotAPPFoundSignature();
    });
      it(`Should fill in full name`, () => {
        PageObjects.Acp.fillInFullName('Maria LL');
    });
    it('Should handle the recaptcha here', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it(`Should click on submit btn`, () => {
        PageObjects.Acp.clickOnSubmitBtn();
    });
    it(`Should assert that the aco app is not found`, () => {
        cy.get('[data-cy="acpAPPNotFound"]').should('have.text','Your ACP application is not found.');
    });
  
});