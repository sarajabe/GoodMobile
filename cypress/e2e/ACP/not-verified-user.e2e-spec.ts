import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then enroll in ACP plan', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.EMPTY_ACCOUNT.EMAIL, CONSTANT.ACCESS.EMPTY_ACCOUNT.PASSWORD);
     });
     it('Should click on login button', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should go to account summary page', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
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
     it(`Should fill in personal info - part 1`, () => {
          PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.PERSONAL_INFO.FIRST_NAME,
               CONSTANT.ACP_DATA.PERSONAL_INFO.LAST_NAME);
     });
     it('Should click on  birth month', () => {
          cy.get('select').eq(0).select('03', { force: true }).should('have.value', '03');
          cy.get('select').eq(1).select('04', { force: true }).should('have.value', '04');
     });
     it(`Should fill in personal info - part 2`, () => {
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
     it(`Should fill in invalid phone number`, () => {
          PageObjects.Acp.fillInPhoneNumber(
               CONSTANT.ACP_DATA.INVALID_PERSONAL_INFO.INVALID_PHONE_NUMBER);
     });
     it(`Should fill in the email`, () => {
          PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.PERSONAL_INFO.Email);
     });
     it('Should click on Next btn - move to step 2', () => {
          PageObjects.Acp.clickOnNextBtn();
     });
     it('Should go to acp - validate page - part2', () => {
          PageObjects.TitleExpectations.goToACPEnrollemntPage();
     });
     it('Should click on Next btn- move to step 3', () => {
          PageObjects.Acp.clickOnNextBtn();
     });
     it('Should stay in acp page - and move to step 3 to fill in address', () => {
          PageObjects.TitleExpectations.goToACPEnrollemntPage();
          cy.get('.step-title').should('have.text','Addresses Information');
      });
     it(`Should fill in address info`, () => {
          PageObjects.Acp.fillInPhysicalAddressInfo(CONSTANT.ACP_DATA.ADDRESS_INFO.ADDRESS_LINE1,
               CONSTANT.ACP_DATA.ADDRESS_INFO.CITY);
     });
     it(`Should fill in address info part 2`, () => {
          PageObjects.Acp.fillInPhysicalAddressInfo2(
               CONSTANT.ACP_DATA.ADDRESS_INFO.STATE,
               CONSTANT.ACP_DATA.ADDRESS_INFO.ZIP);
     });
     it(`Should fill in maling address info`, () => {
          PageObjects.Acp.fillInMailingAddress(CONSTANT.ACP_DATA.ADDRESS_INFO.ADDRESS_LINE1,
               CONSTANT.ACP_DATA.ADDRESS_INFO.CITY);
     });
     it(`Should fill in maling address info 2`, () => {
          PageObjects.Acp.fillInMailingAddress2(CONSTANT.ACP_DATA.ADDRESS_INFO.STATE,
               CONSTANT.ACP_DATA.ADDRESS_INFO.ZIP);
     });
     it('Should check that the verify btn is enabled', () => {
          cy.get('[data-cy="verifyBtn"]').should('not.be.disabled');
     });
     it('Should stay in ACP - validate page ', () => {
          PageObjects.TitleExpectations.goToACPEnrollemntPage();
     });
});
