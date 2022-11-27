import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Verify new ACP user without app ID - app not completed', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.EMPTY_USER.EMAIL, CONSTANT.ACCESS.EMPTY_USER.PASSWORD);
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
          PageObjects.HomePage.clickOnPurchaseNewPlan();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
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
    it(`Should check the Yes without id radio btn`, () => {
        PageObjects.Acp.checkYesWithoutIDRadioBtn();
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it('Should go to the Free UNLIMITED cell phone service with Government program | Good2Go Mobile page', () => {
        PageObjects.TitleExpectations.goToACPEnrollemntPage();
    });
    it(`Should fill in personal info - the first and the last name`, () => {
        PageObjects.Acp.fillInPersonalInfoPart1(CONSTANT.ACP_DATA.APPLICATION_PENDING.FIRST_NAME,
            CONSTANT.ACP_DATA.APPLICATION_PENDING.LAST_NAME);
    });
    it('Should click on  birth month', () => {
        cy.get('select').eq(0).select('08', { force: true }).should('have.value', '08');
        cy.get('select').eq(1).select('11', { force: true }).should('have.value', '11');
    });
    it(`Should fill birth year`, () => {
        PageObjects.Acp.fillInPersonalInfoPart2('1996');
    });
    it(`Should chose ssn `, () => {
        PageObjects.Acp.clickOnSSNRadio();
    });
    it(`Should fill in SSN name`, () => {
        PageObjects.Acp.fillInSSN(CONSTANT.ACP_DATA.APPLICATION_PENDING.SSN);
    });
    it(`Should fill in the email`, () => {
        PageObjects.Acp.fillInEmail(CONSTANT.ACP_DATA.APPLICATION_PENDING.EMAIL);
    });
    it(`Should click on next btn`, () => {
        PageObjects.Acp.clickOnNextBtn();
    });
    it(`Should fill in signutures`, () => {
        PageObjects.Acp.firstCheckSignUp();
        PageObjects.Acp.secondCheckSignUp();
        PageObjects.Acp.thirdCheckSignUp();
        PageObjects.Acp.forthCheckSignUp();
    });
});