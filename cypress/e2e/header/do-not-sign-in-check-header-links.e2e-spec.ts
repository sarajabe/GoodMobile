import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Do Not Sign in , insure from the links in header menu */
/* ********************************* */

describe('Do not Sign in to insure from the links in header menu', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on shop menu to shop for a new plan', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on purchase new plan plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should click on shop menu to shop for phones', () => {
        PageObjects.HomePage.clickOnPhones();
    });
    it('Should click on purchase phone', () => {
        PageObjects.HomePage.clickOnPhones();
    });
    it('Should go to phones page', () => {
        PageObjects.TitleExpectations.goToPhonesPage();
    });
    it('Should click on bring your phone link', () => {
        PageObjects.HomePage.clickOnBringYourPhone();
    });
    it('Should go to Keep Your Phone | Good2Go Mobile', () => {
        PageObjects.TitleExpectations.goToBringYourPhonePage();
    });
    it('Should click on get started button', () => {
        PageObjects.HomePage.clickOnGetStarted();
    });
    it('Should go to Check Compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    it('Should click coverage link', () => {
        PageObjects.HomePage.clickOnCoverage();
    });
    it('Should go to Coverage page', () => {
        PageObjects.TitleExpectations.goToGood2GoCoveragePage();
    });
    it('Should click activate link', () => {
        PageObjects.HomePage.clickOnActivate();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
});
