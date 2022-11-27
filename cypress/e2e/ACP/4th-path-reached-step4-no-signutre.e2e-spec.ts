import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign up then enroll in ACP plan - reach agreement section - fill in signature and then leave it- repeat and check that', () => {
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
    it('Should go to sign up', () => {
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
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.PERSONAL_INFO.FIRST_NAME,
            CONSTANT.ACP_DATA.PERSONAL_INFO.LAST_NAME);
    });
    it('Should click on  birth month', () => {
        cy.get('select').eq(0).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(1).select('03', { force: true }).should('have.value', '03');
    });
    it(`Should fill in birth day and year`, () => {
        PageObjects.Acp.fillInPersonalInfoPart2(
            CONSTANT.ACP_DATA.PERSONAL_INFO.YEAR);
    });
    it('Should click on ID type SSN', () => {
        cy.get('select').eq(2).select('SSN', { force: true }).should('have.value', 'ssn');
    });
    it(`Should fill in the ssn`, () => {
        PageObjects.Acp.fillInSSN(
            CONSTANT.ACP_DATA.PERSONAL_INFO.SSN_NO);
    });
    it(`Should fill in the email`, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.PERSONAL_INFO.Email);
    });
    it('Should click on Next btn to be moved to the qyalifying program section', () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should stay in acp page - and move to the qualifying program section ', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
        cy.get('.step-title').should('have.text','Qualified Programs');
    });
    it('Should chose qualifying program', () => {
        cy.get('li').eq(10).click({ force: true });
    });
    it('Should click on Next btn- move tothe physical address section', () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should stay in acp page - and move the address section', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
        cy.get('.step-title').should('have.text','Addresses Information');
    });
    it(`Should fill in address info`, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo(CONSTANT.ACP_DATA.VERIFIED_ADDRESS.ADDRESS_LINE1,
            CONSTANT.ACP_DATA.VERIFIED_ADDRESS.CITY);
    });
    it(`Should fill in address info part 2`, () => {
        PageObjects.Acp.fillInPhysicalAddressInfo2(
            CONSTANT.ACP_DATA.VERIFIED_ADDRESS.STATE,
            CONSTANT.ACP_DATA.VERIFIED_ADDRESS.ZIP);
    });
    it(`Should fill in maling address info`, () => {
        PageObjects.Acp.fillInMailingAddress(CONSTANT.ACP_DATA.VERIFIED_ADDRESS.ADDRESS_LINE1,
            CONSTANT.ACP_DATA.VERIFIED_ADDRESS.CITY);
    });
    it(`Should fill in maling address info - the state and the zip`, () => {
        PageObjects.Acp.fillInMailingAddress2(CONSTANT.ACP_DATA.VERIFIED_ADDRESS.STATE,
            CONSTANT.ACP_DATA.VERIFIED_ADDRESS.ZIP);
    });
    it(`Should click on verify btn`, () => {
        PageObjects.Acp.clickOnVerifyBtn();
    });
    it('Should stay in ACP - validate page - and go to the signature section', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
        cy.get('.step-title').should('have.text','Customer Notice and Agreement');
    });
    it(`Should fill in signutures`, () => {
        PageObjects.Acp.firstCheck();
        PageObjects.Acp.secondCheck();
        PageObjects.Acp.thirdCheck();
        PageObjects.Acp.forthCheck();
    });
    //repeat the flow 
    // then make sure that signature input fields are empty once we get back to the signature form
    it('Should click on shop menu to click on plans', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans', () => {
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
    it('Should go to ACP - validate page', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it('Should click on Next btn - move to the personal info section', () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should stay in acp page - and move to step three - personal info', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it('Should click on Next btn - move to step 2', () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should stay in acp page - and move to qualifying program secion', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
   
    it('Should click on Next btn', () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should stay in acp page - and move to address secion', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it('Should click on Next btn', () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should stay in ACP - validate page - and go to the signature section', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
        cy.get('.step-title').should('have.text','Customer Notice and Agreement');
    });
    it('Should make sure that the signature input fields are empty', () => {
        cy.get('[data-cy="firstCheck"]').should('have.value', '');
        cy.get('[data-cy="secondCheck"]').should('have.value', '');
        cy.get('[data-cy="thirdCheck"]').should('have.value', '');
        cy.get('[data-cy="forthCheck"]').should('have.value', '');
    });
});
