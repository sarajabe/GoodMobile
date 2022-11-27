import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in - check ACP btns validity within the acp landing page', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST10_ACCOUNT.EMAIL, CONSTANT.ACCESS.TEST10_ACCOUNT.PASSWORD);
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
     it('Should check that the Visit national verifier link is enabled', () => {
          cy.get(':nth-child(1) > .box-link').should('not.be.disabled');
     });
     it('Should click on View Fderal Assistance ProgramBtn', () => {
          cy.get('.margin > .box-link').should('not.be.disabled');
     });
     it('Should click on Check eligibility btn', () => {
          cy.get('.step-link > a').should('not.be.disabled');
     });
     it('Should click on Why is good2go offering this program', () => {
          PageObjects.Acp.clickOnWhyOfferingBtn();
     });
     it('Should click on who is eligible for the ACP program', () => {
          PageObjects.Acp.clickOnWhoIsEligibile();
     });
     it('Should click on How do I know if I qualify for the ACP program', () => {
          PageObjects.Acp.clickOnHowDoIknow();
     });
     it('Should click on More FAQS', () => {
          PageObjects.Acp.clickOnMoreFaqs();
     });
     it('Should click on I have Lifeline service, am I eligible for the ACP at good2go mobile?', () => {
          PageObjects.Acp.clickOnIHaveLifelineService();
     });
     it('Should click on What plans are eligible for the ACP at good2go mobile?', () => {
          PageObjects.Acp.clickOnWhatPlansAreEligible();
     });
     it('Should click on are any business type accounts eligible for the ACP discount', () => {
          PageObjects.Acp.clickOnAreAnyBusinessTypeAccountsEligibleForTheACPDiscount();
     });
     it('Should click on How do I know if I qualify for the ACP program', () => {
          PageObjects.Acp.clickOnHowDoIknow();
     });
     it('Should click on Are any business type accounts eligible for the ACP discount?', () => {
          PageObjects.Acp.clickOnAreAnyBusinessTypeAccountsEligibleForTheACPDiscount();
     });
     it('Should click on Less FAQS', () => {
          PageObjects.Acp.clickOnLessFaqsBtn();
     });
     it('Should stay in ACP page', () => {
          PageObjects.TitleExpectations.goToACPPage();
     });
});