import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Verify new ACP user without app ID with status complete - sign up', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on good2go logo to go to the home page', () => {
        PageObjects.HomePage.clickOnG2gLogo();
    });
    it('Should shop menu', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should swipe banner', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to acp loanding page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should click on learn more btn', () => {
        PageObjects.Acp.clickOnLearnMoreBtn();
    });
    it('Should go to acp loanding page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on start here btn', () => {
        PageObjects.Acp.clickOnApplyNowBtn();
    });
    it('Should go to acp sign up page', () => {
        PageObjects.TitleExpectations.goToACPSignUpPage();
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
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
    });
    it('Should click on submit', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
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
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('09', { force: true }).should('have.value', '09');
        cy.get('select').eq(1).select('19', { force: true }).should('have.value', '19');
        cy.get('select').eq(2).select('1983', { force: true }).should('have.value', '1983');
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.EMAIL);
    });
    it(`Should click on tribal radio btn`, () => {
        PageObjects.Acp.clickOnTribalRadio();
    });
    it(`Should fill in tribal id `, () => {
        PageObjects.Acp.fillITribalID(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.TRIBAL_ID);
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
        PageObjects.Acp.fillInPhysicalAddressInfo(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.ADDRESS1, CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.CITY);
    });
    it(`Should fill in address - State & zip code `, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo2(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.STATE, CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.ZIP_CODE);
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
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.FIRST_NAME,
            CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.LAST_NAME);
    });
    it('Should select birth date', () => {
        cy.get('select').eq(0).select('09', { force: true }).should('have.value', '09');
        cy.get('select').eq(1).select('19', { force: true }).should('have.value', '19');
        cy.get('select').eq(2).select('1983', { force: true }).should('have.value', '1983');
    });
    it(`Should fill in the email `, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.EMAIL);
    });
    it(`Should click on tribal radio btn`, () => {
        PageObjects.Acp.clickOnTribalRadio();
    });
    it(`Should fill in tribal id `, () => {
        PageObjects.Acp.fillITribalID(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.TRIBAL_ID);
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
        PageObjects.Acp.fillInPhysicalAddressInfo(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.ADDRESS1, CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.CITY);
    });
    it(`Should fill in address - State & zip code `, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo2(CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.STATE, CONSTANT.ACP_DATA.ACP_APP_WITHOUT_ID_COMPLETE.ZIP_CODE);
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
    it(`Should assert that the app is complete`, () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        cy.get('.head-note').should('have.text', 'Congratulations!');
    });
});