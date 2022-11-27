import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Transfer ACP app - app not complete', () => {
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
    it('Should click on Enrol now btn', () => {
        PageObjects.Acp.clickOnApplyNowBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page', () => {
        PageObjects.TitleExpectations.goToFreePhoneServicePage();
    });
    it(`Should check the Yes without id radio btn`, () => {
        PageObjects.Acp.checkYesWithoutIDRadioBtn();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page', () => {
        PageObjects.TitleExpectations.goToFreePhoneServicePage();
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('01', { force: true }).should('have.value', '01');
        cy.get('select').eq(1).select('19', { force: true }).should('have.value', '19');
        cy.get('select').eq(2).select('1991', { force: true }).should('have.value', '1991');
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.EMAIL);
    });
    it(`Should chose ssn `, () => {
        PageObjects.Acp.clickOnSSNRadio();
    });
    it(`Should fill in SSN name`, () => {
        PageObjects.Acp.fillInSSN(CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.LAST4SSN);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should fill in address info`, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo(CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.ADDRESS1,
            CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.CITY);
    });
    it(`Should fill in address info part 2`, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo2(
            CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.STATE,
            CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.ZIP_CODE);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should click I qualify as indiviual`, () => {
        PageObjects.Acp.clickOnIQualifyIndividually();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page - signatures section', () => {
        PageObjects.TitleExpectations.goToFreePhoneServicePage();
    });
    it(`Should fill in signutures`, () => {
        PageObjects.Acp.NotCompleteAPPSignature();
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should assert that the radio of I qualify as an individual`, () => {
        cy.get('#indivisual').should('be.checked');
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should assert that the address fields exist`, () => {
        cy.get('[data-cy="addressLookup"]').should('have.value','628 Wilmar Farm Road')
        cy.get('[data-cy="city"]').should('have.value','BERWICK');
        cy.get('[data-cy="state"]').should('exist','ME');
        cy.get('[data-cy="zipCode"]').should('exist','03901');
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert that the radio exist and still checked`, () => {
        cy.get('#indivisual').should('exist');
        cy.get('#indivisual').should('be.checked');
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should assert that the address fields exist`, () => {
        cy.get('[data-cy="addressLookup"]').should('exist')
        cy.get('[data-cy="city"]').should('exist');
        cy.get('[data-cy="state"]').should('exist');
        cy.get('[data-cy="zipCode"]').should('exist');


        cy.get('[data-cy="addressLookup"]').should('have.value','628 Wilmar Farm Road')
        cy.get('[data-cy="city"]').should('have.value','BERWICK');
        cy.get('[data-cy="state"]').should('exist','ME');
        cy.get('[data-cy="zipCode"]').should('exist','03901');
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should click on back button`, () => {
      cy.get('[data-cy="firstName"]').should('exist');
      cy.get('[data-cy="middleName"]').should('exist');
      cy.get('[data-cy="lastName"]').should('exist');

      cy.get('[data-cy="firstName"]').should('have.value','Maria');
      cy.get('[data-cy="lastName"]').should('have.value','Yool');
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert that the address fields exist`, () => {
        cy.get('[data-cy="addressLookup"]').should('exist')
        cy.get('[data-cy="city"]').should('exist');
        cy.get('[data-cy="state"]').should('exist');
        cy.get('[data-cy="zipCode"]').should('exist');


        cy.get('[data-cy="addressLookup"]').should('have.value','628 Wilmar Farm Road')
        cy.get('[data-cy="city"]').should('have.value','BERWICK');
        cy.get('[data-cy="state"]').should('exist','ME');
        cy.get('[data-cy="zipCode"]').should('exist','03901');
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert that the radio exists and still checked`, () => {
        cy.get('#indivisual').should('exist');
        cy.get('#indivisual').should('be.checked');
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
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should assert that the radio of I qualify as an individual`, () => {
        cy.get('#yes-without-id').should('be.checked');
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('01', { force: true }).should('have.value', '01');
        cy.get('select').eq(1).select('19', { force: true }).should('have.value', '19');
        cy.get('select').eq(2).select('1991', { force: true }).should('have.value', '1991');
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.EMAIL);
    });
    it(`Should chose ssn `, () => {
        PageObjects.Acp.clickOnSSNRadio();
    });
    it(`Should fill in SSN name`, () => {
        PageObjects.Acp.fillInSSN(CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.LAST4SSN);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should fill in address info`, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo(CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.ADDRESS1,
            CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.CITY);
    });
    it(`Should fill in address info part 2`, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo2(
            CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.STATE,
            CONSTANT.ACP_DATA.ACP_APP_NOT_COMPLETE.ZIP_CODE);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should click I qualify as indiviual`, () => {
        PageObjects.Acp.clickOnIQualifyIndividually();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page - signatures section', () => {
        PageObjects.TitleExpectations.goToFreePhoneServicePage();
    });
    it(`Should fill in signutures`, () => {
        PageObjects.Acp.NotCompleteAPPSignature();
    });
      it(`Should fill in full name`, () => {
        PageObjects.Acp.fillInFullName('Maria Yool');
    });
    it(`Should click on submit btn`, () => {
        PageObjects.Acp.clickOnSubmitBtn();
    });











   
});