import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Do not sign in then check compatibility tmo - iphone', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on bring your phone', () => {
        PageObjects.HomePage.clickOnBringYourPhone();
    });
    it('Should go to check compatibility page', () => {
        PageObjects.TitleExpectations.goToBringYourPhonePage();
    });
    it('Should click on get started button', () => {
        PageObjects.HomePage.clickOnGetStarted();
    });
    it('Should go to check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    it('Should enter the IME number and address reference', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_ATT);
        PageObjects.Compatibility.enterAddressRef();
        cy.get('[data-cy=equipmentNumber]').click();
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check phone button', () => {
        PageObjects.Compatibility.clickOnCheckPhoneButton();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on continue button in pop up window', () => {
        PageObjects.HomePage.clickOnContinue();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
});
