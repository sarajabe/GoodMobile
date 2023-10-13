import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign in , insure from the links in footer */
/* ********************************* */

describe('Sign in to insure from the links in footer', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST_USER.EMAIL, CONSTANT.ACCESS.TEST_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on cell phone plans in footer menu', () => {
        PageObjects.Footer.clickOnCellPhonePlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansGMPage();
    });
    it('Should click on ACP devices', () => {
        PageObjects.Footer.clickOnAcpDevices();
    });
    it('Should go to ACP devices page', () => {
        PageObjects.TitleExpectations.goToACPApplicationDevicesPage();
    });
    it('Should click on account summary', () => {
        PageObjects.Footer.clickOnAccountSummary();
    });
    it('Should go to account summary page 2', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on pay and refill account', () => {
        PageObjects.Footer.clickOnPayAndRefill();
    });
    it('Should go to Account Pay and Renew page', () => {
        PageObjects.TitleExpectations.goToPayAndRefillPage();
    });
    it('Should click on Payment history', () => {
        PageObjects.Footer.clickOnPaymentHistory();
    });
    it('Should go to Payment history page', () => {
        PageObjects.TitleExpectations.goToPaymentHistoryPage();
    });
    it('Should click on your orders', () => {
        PageObjects.Footer.clickOnYourOrders();
    });
    it('Should go to orders page', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on usage', () => {
        PageObjects.Footer.clickOnUsage();
    });
    it('Should go to Usage History page', () => {
        PageObjects.TitleExpectations.goToUsageHistoryPage();
    });
    it('Should click on Manage Device', () => {
        PageObjects.Footer.clickOnManageDevice();
    });
    it('Should go to Manage Devices page', () => {
        PageObjects.TitleExpectations.goToManageDevicesPage();
    });
    it('Should click on profile setting', () => {
        PageObjects.Footer.clickOnProfileSetting();
    });
    it('Should go to Settings page', () => {
        PageObjects.TitleExpectations.goToProfileSettingsPage();
    });
    it('Should click on ACP', () => {
        PageObjects.Footer.clickOnACPApplication();
    });
    it('Should go to ACP page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on WiFi Calling', () => {
        PageObjects.Footer.clickOnWiFiCalling();
    });
    it('Should go to WiFi Calling page', () => {
        PageObjects.TitleExpectations.goToWifiCallingPage();
    });
    it('Should click on Set Up Your Data', () => {
        PageObjects.Footer.clickOnSetUpYourData();
    });
    it('Should go to GM Mobile Data Setup page', () => {
        PageObjects.TitleExpectations.goToSetupYourPhoneDataPage();
    });
    it('Should click on HD Voice', () => {
        PageObjects.Footer.clickOnHdVoice();
    });
    it('Should go to HD Voice page', () => {
        PageObjects.TitleExpectations.goToHDVoicePage();
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
    it('Should go to General GM Mobile | Support | Contact Us page', () => {
        PageObjects.TitleExpectations.goToContactUsPage();
    });
    it('Should click on site map', () => {
        PageObjects.Footer.clickOnSiteMap();
    });
    it('Should go to GM Sitemap page', () => {
        PageObjects.TitleExpectations.goToSiteMapPage();
    });
    it('Should click on about gm', () => {
        PageObjects.Footer.clickOnAboutGM();
    });
    it('Should go to GMMobile | About GM page', () => {
        PageObjects.TitleExpectations.goToAboutGMPage();
    });
    it('Should click on why gm', () => {
        PageObjects.Footer.clickOnWhyGM();
    });
    it('Should go to GM Mobile | Why GM? page', () => {
        PageObjects.TitleExpectations.goToWhyGMPage();
    });
    it('Should click on how it works', () => {
        PageObjects.Footer.clickOnHowItWorks();
    });
    it('Should go to GM| How It Works page', () => {
        PageObjects.TitleExpectations.goToHowItWorksPage();
    });
    it('Should click on intl. calling', () => {
        PageObjects.Footer.clickOnIntlCalling();
    });
    it('Should go to GM| International Calling page', () => {
        PageObjects.TitleExpectations.goToInternationalCallingPage();
    });
    it('Should click on Terms And Condition', () => {
        PageObjects.Footer.clickOnTermsAndCondition();
    });
    it('Should go to GM Mobile | Support | Terms & Conditions page', () => {
        PageObjects.TitleExpectations.goToTermsAndConditionsPage();
    });
    it('Should scroll down the  page', () => {
        cy.scrollTo('bottom');
    });
    it('Should click on Hearing Aid Compatibility', () => {
        PageObjects.Footer.clickOnHearingAid();
    });
    it('Should go to GM Mobile | Support | Hearing Aid Compatibility page', () => {
        PageObjects.TitleExpectations.goToHearingAidCompatibilityPage();
    });
});
