import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe('test the about g2g pages` btns ', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on about good2go', () => {
        PageObjects.Footer.clickOnAboutG2G();
    });
    it('Should go to Good2GoMobile | About Good2Go page', () => {
        PageObjects.TitleExpectations.goToAboutGood2GoPage();
    });
    it('The url should include support/aboutgood2go', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/aboutgood2go`);
    });
    it('Should click on go to plans btn', () => {
        PageObjects.aboutPages.clickOnGoToPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should click on why good2go', () => {
        PageObjects.Footer.clickOnWhyG2G();
    });
    it('Should go to Good2Go Mobile | Why Good2Go? page', () => {
        PageObjects.TitleExpectations.goToWhyGood2GoPage();
    });
    it('The url should include support/whygood2go', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/whygood2go`);
    });
    it('Should click on go to plans btn', () => {
        PageObjects.aboutPages.clickOnGoToPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should click on how it works', () => {
        PageObjects.Footer.clickOnHowItWorks();
    });
    it('Should go to Good2Go| How It Works page', () => {
        PageObjects.TitleExpectations.goToHowItWorksPage();
    });
    it('The url should include support/how-it-works', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/how-it-works`);
    });
    it('Should click shop for phones btn', () => {
        PageObjects.aboutPages.clickOnShopForPhones();
    });
    it('Should go to Good2Go phones page', () => {
        PageObjects.TitleExpectations.goToPhonesPage();
    });
    it('Should click on how it works', () => {
        PageObjects.Footer.clickOnHowItWorks();
    });
    it('Should go to Good2Go| How It Works page', () => {
        PageObjects.TitleExpectations.goToHowItWorksPage();
    });
    it('Should click on bring your phone btn', () => {
        PageObjects.aboutPages.clickOnBringYourPhone();
    });
    it('Should go to check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    it('Should click on how it works', () => {
        PageObjects.Footer.clickOnHowItWorks();
    });
    it('Should go to Good2Go| How It Works page', () => {
        PageObjects.TitleExpectations.goToHowItWorksPage();
    });
    it('Should click on view all plans btn', () => {
        PageObjects.aboutPages.clickOnViewAllPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should click on how it works', () => {
        PageObjects.Footer.clickOnHowItWorks();
    });
    it('Should go to Good2Go| How It Works page', () => {
        PageObjects.TitleExpectations.goToHowItWorksPage();
    });
    it('Should click on g2g faqs btn', () => {
        PageObjects.aboutPages.clickOnG2gFAQs();
    });
    it('Should go to faqs page', () => {
        PageObjects.TitleExpectations.goToFaqsPage();
    });
    it('Should click on general questions btn', () => {
        PageObjects.faqsPage.clickOnGeneral();
    });
    it('The url should include support/faqs/general-questions', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/faqs/general-questions`);
    });
    it('Should click on billing btn', () => {
        PageObjects.faqsPage.clickOnBilling();
    });
    it('The url should include support/faqs/billing', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/faqs/billing`);
    });
    it('Should click on phone set-up btn', () => {
        PageObjects.faqsPage.clickOnPhoneSetup();
    });
    it('The url should include support/faqs/billing', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/faqs/phone-set-up`);
    });
    it('Should click on phone pay as you go', () => {
        PageObjects.faqsPage.clickOnPayAsYouGo();
    });
    it('The url should include support/faqs/pay-as-you-go', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/faqs/pay-as-you-go`);
    });
    it('Should click on using phone', () => {
        PageObjects.faqsPage.clickOnUsingPhone();
    });
    it('The url should include support/faqs/using-phone', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/faqs/using-phone`);
    });
    it('Should click on wifi calling', () => {
        PageObjects.faqsPage.clickOnWifiCalling();
    });
    it('The url should include support/faqs/wifi-calling', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/faqs/wifi-calling`);
    });
    it('Should click on HD Voice', () => {
        PageObjects.faqsPage.clickOnHDVoice();
    });
    it('The url should include support/faqs/wifi-calling', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/faqs/hd-voice`);
    });
    it('Should click on Support', () => {
        PageObjects.faqsPage.clickOnSupport();
    });
    it('The url should include support/faqs/wifi-calling', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/faqs/support`);
    });
    it('Should click on intl. calling', () => {
        PageObjects.Footer.clickOnIntlCalling();
    });
    it('Should go to Good2Go| International Calling page', () => {
        PageObjects.TitleExpectations.goToInternationalCallingPage();
    });
    it('The url should include support/international-calling', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/international-calling`);
    });
});
