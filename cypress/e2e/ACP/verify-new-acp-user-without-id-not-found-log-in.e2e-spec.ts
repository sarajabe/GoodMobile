import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Verify new ACP user without app ID with status not found - login', () => {
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
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.WITHOUT_ID_NOT_FOUND.EMAIL, CONSTANT.ACCESS.WITHOUT_ID_NOT_FOUND.PASSWORD);
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
    it('Should click on apply now btn', () => {
        PageObjects.Acp.clickOnApplyNowBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it(`Should assert that we were redirected to the first step of deciding whether we have an ACP APP ID or not`, () => {
        cy.get('[data-cy="id-decision"]').should('have.text', 'Do you have an ACP application ID?');
    });
    it(`Should check the Yes radio btn`, () => {
        PageObjects.Acp.checkYesWithoutIDRadioBtn();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it(`Should go to personal info form`, () => {
        cy.get('.sub-header').should('have.text', 'Please provide the following information to verify your application!');
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('11', { force: true }).should('have.value', '11');
        cy.get('select').eq(1).select('08', { force: true }).should('have.value', '08');
        cy.get('select').eq(2).select('1980', { force: true }).should('have.value', '1980');
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.EMAIL);
    });
    it(`Should click on SSN radio btn`, () => {
        PageObjects.Acp.clickOnSSNRadio();
    });
    it(`Should fill in the last 4 SSN `, () => {
        PageObjects.Acp.fillInSSN(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.LAST4SSN);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page - signatures section', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it('Should assert going to fill the address form', () => {
        cy.get('[data-cy="addressTitle"]').should('have.text', 'What’s your Full Address? *');
    });
    it(`Should fill in address - address line 1 & city `, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.ADDRESS1, CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.CITY);
    });
    it(`Should fill in address - State & zip code `, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo2(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.STATE, CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.ZIP_CODE);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert going to the qualification section`, () => {
        cy.get('[data-cy="qualificationHeader"]').should('have.text', 'How do you Qualify? *');
    });
    it(`Should click on I qualify as an individual`, () => {
        PageObjects.Acp.clickOnIQualifyIndividually();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert going to the Customer Notice and Agreement step`, () => {
        cy.get('.sub-header').should('have.text', 'Customer Notice and Agreement');
    });
    it(`Should fill in signutures`, () => {
        PageObjects.Acp.pendingReviewInitials();
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should assert going to the qualification section`, () => {
        cy.get('[data-cy="qualificationHeader"]').should('have.text', 'How do you Qualify? *');
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert going to the Customer Notice and Agreement step`, () => {
        cy.get('.sub-header').should('have.text', 'Customer Notice and Agreement');
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it('Should assert going to fill the address form', () => {
        cy.get('[data-cy="addressTitle"]').should('have.text', 'What’s your Full Address? *');
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should click on back button`, () => {
        PageObjects.Acp.clickOnBackBtn();
    });
    it(`Should assert that we were redirected to the first step of deciding whether we have an ACP APP ID or not`, () => {
        cy.get('[data-cy="id-decision"]').should('have.text', 'Do you have an ACP application ID?');
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should go to personal info form`, () => {
        cy.get('.sub-header').should('have.text', 'Please provide the following information to verify your application!');
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('11', { force: true }).should('have.value', '11');
        cy.get('select').eq(1).select('08', { force: true }).should('have.value', '08');
        cy.get('select').eq(2).select('1980', { force: true }).should('have.value', '1980');
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.EMAIL);
    });
    it(`Should click on SSN radio btn`, () => {
        PageObjects.Acp.clickOnSSNRadio();
    });
    it(`Should fill in the last 4 SSN `, () => {
        PageObjects.Acp.fillInSSN(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.LAST4SSN);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page - signatures section', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it('Should assert going to fill the address form', () => {
        cy.get('[data-cy="addressTitle"]').should('have.text', 'What’s your Full Address? *');
    });
    it(`Should fill in address - address line 1 & city `, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.ADDRESS1, CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.CITY);
    });
    it(`Should fill in address - State & zip code`, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo2(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.STATE, CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.ZIP_CODE);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert going to the qualification section`, () => {
        cy.get('[data-cy="qualificationHeader"]').should('have.text', 'How do you Qualify? *');
    });
    it(`Should click on I qualify as an individual`, () => {
        PageObjects.Acp.clickOnIQualifyIndividually();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should assert going to the Customer Notice and Agreement step`, () => {
        cy.get('.sub-header').should('have.text', 'Customer Notice and Agreement');
    });
    it(`Should fill in signutures`, () => {
        PageObjects.Acp.pendingReviewInitials();
    });
    it(`Should fill in full name`, () => {
        PageObjects.Acp.fillInFullName(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_PENDING_REVIEW.FULL_NAME);
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo1();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it(`Should click on submit btn`, () => {
        PageObjects.Acp.clickOnSubmitBtn();
    });
    it(`Should assert that the aco app is not found`, () => {
        cy.get('[data-cy="acpAPPNotFound"]').should('have.text','Your ACP application is not found.');
    });
});