import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'
/* ********************************* */
/* Do not sign in , insure from the links in footer */
/* ********************************* */

describe('Do not sign in to insure from the links in footer', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on cell phone plans in footer menu', () => {
        PageObjects.Footer.clickOnCellPhonePlans();
    });
    it('Should click on cell phones', () => {
        PageObjects.Footer.clickOnCellPhones();
    });
    it('Should go to phones page', () => {
        PageObjects.TitleExpectations.goToPhonesPage();
    });
    it('Should click on 3G shutdown', () => {
        PageObjects.Footer.clickOn3GShutdown();
    });
    it('Should go to 3G shutdown page', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
    });
    it('Should click on account summary', () => {
        PageObjects.Footer.clickOnAccountSummary();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should click on pay and refill account', () => {
        PageObjects.Footer.clickOnPayAndRefill();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should click on Payment history', () => {
        PageObjects.Footer.clickOnPaymentHistory();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should click on usage', () => {
        PageObjects.Footer.clickOnUsage();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should click on Manage Device', () => {
        PageObjects.Footer.clickOnManageDevice();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should click on profile setting', () => {
        PageObjects.Footer.clickOnProfileSetting();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should click on ACP', () => {
        PageObjects.Footer.clickOnACPApplication();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on Set Up Your Data', () => {
        PageObjects.Footer.clickOnSetUpYourData();
    });
    it('Should go to Data Setup page', () => {
        PageObjects.TitleExpectations.goToSetupYourPhoneDataPage();
    });
    it('Should click on Faqs', () => {
        PageObjects.Footer.clickOnFaqs();
    });
    it('Should go to FAQs page', () => {
        PageObjects.TitleExpectations.goToFaqsPage();
    });
    it('Should click on Contact Us', () => {
        PageObjects.Footer.clickOnContactUs();
    });
    it('Should go to General Good2Go Mobile | Support | Contact Us page', () => {
        PageObjects.TitleExpectations.goToContactUsPage();
    });
    it('Should click on site map', () => {
        PageObjects.Footer.clickOnSiteMap();
    });
    it('Should go to Good2Go Sitemap page', () => {
        PageObjects.TitleExpectations.goToSiteMapPage();
    });
    it('Should click on about good2go', () => {
        PageObjects.Footer.clickOnAboutG2G();
    });
    it('Should go to Good2GoMobile | About Good2Go page', () => {
        PageObjects.TitleExpectations.goToAboutGood2GoPage();
    });
    it('Should click on why good2go', () => {
        PageObjects.Footer.clickOnWhyG2G();
    });
    it('Should go to Good2Go Mobile | Why Good2Go? page', () => {
        PageObjects.TitleExpectations.goToWhyGood2GoPage();
    });
    it('Should click on how it works', () => {
        PageObjects.Footer.clickOnHowItWorks();
    });
    it('Should go to Good2Go| How It Works page', () => {
        PageObjects.TitleExpectations.goToHowItWorksPage();
    });
    it('Should click on intl. calling', () => {
        PageObjects.Footer.clickOnIntlCalling();
    });
    it('Should go to Good2Go| International Calling page', () => {
        PageObjects.TitleExpectations.goToInternationalCallingPage();
    });
    it('Should click on Terms And Condition', () => {
        PageObjects.Footer.clickOnTermsAndCondition();
    });
    it('Should go to Good2Go Mobile | Support | Terms & Conditions page', () => {
        PageObjects.TitleExpectations.goToTermsAndConditionsPage();
    });
    it('Should click on Hearing Aid Compatibility', () => {
        PageObjects.Footer.clickOnHearingAid();
    });
    it('Should go to Good2Go Mobile | Support | Hearing Aid Compatibility page', () => {
        PageObjects.TitleExpectations.goToHearingAidCompatibilityPage();
    });
});
