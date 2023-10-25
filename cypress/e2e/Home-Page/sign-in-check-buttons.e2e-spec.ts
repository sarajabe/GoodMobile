import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign in , insure from the buttons in home page */
/* ********************************* */
describe('Sign in to insure from the buttons in home page', () => {
     before(() => {
          PageObjects.BeforeAll.executeBeforeAll();
     });
     after(() => {
          PageObjects.AccessControl.logoutFromAccount();
     });
     it('Should login successfully', () => {
          PageObjects.AccessControl.successfulLogin();
     });
     it('Should click on GM Logo ', () => {
          PageObjects.HomePage.clickOnGmLogo();
     });
     it('Should go to home page', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on get it today button', () => {
          PageObjects.HomePage.clickOnGetItToday();
     });
     it('Should go to ACP device page', () => {
          PageObjects.TitleExpectations.goToACPApplicationDevicesPage();
     });
     it('Should click on GM Logo ', () => {
          PageObjects.HomePage.clickOnGmLogo();
     });
     it('Should click on do i qualify button', () => {
          PageObjects.HomePage.clickOnDoIQualifyBtn();
     });
     it('Should go to acp ladning page', () => {
          PageObjects.TitleExpectations.goToACPPage();
     });
     it('Should click on GM Logo ', () => {
          PageObjects.HomePage.clickOnGmLogo();
     });
     it('Should go to home page after being in plans page', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on view all plans button', () => {
          PageObjects.HomePage.clickOnViewAllPlans();
     });
     it('Should go to plans page to see all available plans', () => {
          PageObjects.TitleExpectations.goToPlansGMPage();
     });
     it('Should click on GM Logo ', () => {
          PageObjects.HomePage.clickOnGmLogo();
     });
     it('Should go to home page to select the 6GB ACP plan', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on select plan button for 6GB ACP plan', () => {
          PageObjects.Plans.clickOn6GbACP_From_Home_Page();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansGMPage();
     });
     it('Should click on GM Logo ', () => {
          PageObjects.HomePage.clickOnGmLogo();
     });
     it('Should go to home page to select the 2GB plan ', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on select plan button for 2GB', () => {
          PageObjects.Plans.clickOnPlan_2_GB_Home_Page();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansGMPage();
     });
     it('Should click on GM Logo ', () => {
          PageObjects.HomePage.clickOnGmLogo();
     });
     it('Should go to home page to select the 6GB plan ', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on select plan button for 6GB', () => {
          PageObjects.Plans.clickOn6GB_From_Home_Page();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansGMPage();
     });
     it('Should click on GM Logo ', () => {
          PageObjects.HomePage.clickOnGmLogo();
     });
     it('Should go to home page  to test the check compatibility btn', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on check compatability button', () => {
          PageObjects.HomePage.clickOnCheckCompatibilityBtn();
     });
     it('Should go to Check Compatibility page', () => {
          PageObjects.TitleExpectations.goToCheckCompatibilityPage();
     });
     it('Should click on GM Logo ', () => {
          PageObjects.HomePage.clickOnGmLogo();
     });
     it('Should click on do i qualify button', () => {
          PageObjects.HomePage.clickOnDoIQualifyBtn();
     });
     it('Should go to acp ladning page', () => {
          PageObjects.TitleExpectations.goToACPPage();
     });
     it('Should click on GM Logo ', () => {
          PageObjects.HomePage.clickOnGmLogo();
     });
     it('Should go to home page to test the check your coverage btn ', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on check coverage button', () => {
          PageObjects.HomePage.clickOnCheckCoverageButton();
     });
     it('Should go to GM Coverage page', () => {
          PageObjects.TitleExpectations.goToGMCoveragePage();
     });
     it('Should click on Home', () => {
          cy.get('#home-header').click();
     });
     it('Should go to home page', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
});