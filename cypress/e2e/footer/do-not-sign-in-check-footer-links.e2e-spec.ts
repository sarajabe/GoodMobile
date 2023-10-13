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
    it('Should go to Data Setup page', () => {
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
    it('Should go to General Good Mobile | Support | Contact Us', () => {
        PageObjects.TitleExpectations.goToContactUsPage();
    });
    it('Should click on site map', () => {
        PageObjects.Footer.clickOnSiteMap();
    });
    it('Should go to Good2Go Sitemap page', () => {
        PageObjects.TitleExpectations.goToSiteMapPage();
    });
    it('Should click on about good2go', () => {
        PageObjects.Footer.clickOnAboutGM();
    });
    it('Should go to Good Mobile | About Good Mobile', () => {
        PageObjects.TitleExpectations.goToAboutGMPage();
    });
    it('Should click on why GM', () => {
        PageObjects.Footer.clickOnWhyGM();
    });
    it('Should go to Good2Go Mobile | Why Good2Go? page', () => {
        PageObjects.TitleExpectations.goToWhyGMPage();
    });
    it('Should click on how it works', () => {
        PageObjects.Footer.clickOnHowItWorks();
    });
    it('Should go to Good Mobile | Support | How It Works', () => {
        PageObjects.TitleExpectations.goToHowItWorksPage();
    });
    it('Should click on intl. calling', () => {
        PageObjects.Footer.clickOnIntlCalling();
    });
    it('Should go to Good Mobile | Support | International Calling', () => {
        PageObjects.TitleExpectations.goToInternationalCallingPage();
    });
    it('Should click on Terms And Condition', () => {
        PageObjects.Footer.clickOnTermsAndCondition();
    });
    it('Should go to Good Mobile | Support | Terms & Conditions', () => {
        PageObjects.TitleExpectations.goToTermsAndConditionsPage();
    });
    it('Should click on Hearing Aid Compatibility', () => {
        PageObjects.Footer.clickOnHearingAid();
    });
    it('Should go to Good Mobile | Support | Hearing Aid Compatibility', () => {
        PageObjects.TitleExpectations.goToHearingAidCompatibilityPage();
    });
});
