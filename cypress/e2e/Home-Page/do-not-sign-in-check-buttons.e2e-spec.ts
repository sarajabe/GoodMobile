import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Do Not Sign in , insure from the buttons in home page */
/* ********************************* */
describe('Do not Sign in to insure from the buttons and actions  in home page', () => {
     before(() => {
          PageObjects.BeforeAll.executeBeforeAll();
     });
     it('Should click on G2G Logo ', () => {
          PageObjects.HomePage.clickOnG2gLogo();
     });
     it('Should go to home page', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on learn more button', () => {
          PageObjects.HomePage.clickOnLearnMoreBtn();
     });
     it('Should go to plans page to buy a plan', () => {
          PageObjects.TitleExpectations.goToPlansPage();
     });
     it('Should click on G2G Logo ', () => {
          PageObjects.HomePage.clickOnG2gLogo();
     });
     it('Should go to home page after being in plans page', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on view all plans button', () => {
          PageObjects.HomePage.clickOnViewAllPlans();
     });
     it('Should go to plans page to see all available plans', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
     it('Should click on G2G Logo ', () => {
          PageObjects.HomePage.clickOnG2gLogo();
     });
     it('Should go to home page to select the 1GB plan', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on select plan button for 1GB', () => {
          PageObjects.Plans.clickOnPlan_1_GB();
     });
     it('Should go to plans page and see all 1GB plan details', () => {
          PageObjects.TitleExpectations.goToPlansPage();
     });
     it('Should click on G2G Logo ', () => {
          PageObjects.HomePage.clickOnG2gLogo();
     });
     it('Should go to home page to select the 3GB plan ', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on select plan button for 3GB', () => {
          PageObjects.Plans.clickOnPlan3GB();
     });
     it('Should go to plans page and see all 3GB plan details', () => {
          PageObjects.TitleExpectations.goToPlansPage();
     });
     it('Should click on G2G Logo ', () => {
          PageObjects.HomePage.clickOnG2gLogo();
     });
     it('Should go to home page to select the 6GB plan ', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on select plan button for 6GB', () => {
          PageObjects.Plans.clickOnPlan_6_GB();
     });
     it('Should go to plans page and see all 6GB plan details', () => {
          PageObjects.TitleExpectations.goToPlansPage();
     });
     it('Should click on G2G Logo ', () => {
          PageObjects.HomePage.clickOnG2gLogo();
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
     it('Should click on G2G Logo ', () => {
          PageObjects.HomePage.clickOnG2gLogo();
     });
     it('Should go to home page to test the check your coverage btn ', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on check coverage button', () => {
          PageObjects.HomePage.clickOnCheckCoverageButton();
     });
     it('Should go to Good2Go Coverage page', () => {
          PageObjects.TitleExpectations.goToGood2GoCoveragePage();
     });
     it('Should click on G2G Logo ', () => {
          PageObjects.HomePage.clickOnG2gLogo();
     });
     it('Should go to home page to test the check your coverage btn ', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on check your coverage button', () => {
          PageObjects.HomePage.clickOnCheckYourCoverageBtn();
     });
     it('Should go to Good2Go Coverage page', () => {
          PageObjects.TitleExpectations.goToGood2GoCoveragePage();
     });
     it('Should click on G2G Logo', () => {
          PageObjects.HomePage.clickOnG2gLogo();
     });
     it('Should go to home page', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
});
