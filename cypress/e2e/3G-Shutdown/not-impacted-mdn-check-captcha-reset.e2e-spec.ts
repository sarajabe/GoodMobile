import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe('go to to 3g shutdown page and insert a not impacted mdn', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on 3G shutdown', () => {
        PageObjects.Footer.clickOn3GShutdown();
    });
    it('Should go to 3G shutdown page', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
    });
    it('Should fill the input field with not impacted mdn', () => {
        PageObjects.Shutdown3G.fillInMDN(CONSTANT.MDNS.NOT_IMPACTED);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptcha();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on the check btn', () => {
        PageObjects.Shutdown3G.clickOnCheckBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on go to my account summary btn from the pop up', () => {
        PageObjects.Shutdown3G.clickOnGoToMyAccountSummaryNtn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should click on 3G shutdown', () => {
        PageObjects.Footer.clickOn3GShutdown();
    });
    it('Should go to 3G shutdown page', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
    });
    it('Should fill the input field with a not impacted mdn', () => {
        PageObjects.Shutdown3G.fillInMDN(CONSTANT.MDNS.NOT_IMPACTED);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptcha3GShutdown();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on the check btn', () => {
        PageObjects.Shutdown3G.clickOnCheckBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on close icon from the pop up', () => {
        PageObjects.Shutdown3G.clickOnCloseIcon();
    });
    it('Should scroll up and check that the captcha was reset', () => {
        cy.scrollTo('top');
        cy.get('#captcha-box *> iframe').should('not.exist');
    });
    it('Should fill the input field with not impacted mdn', () => {
        PageObjects.Shutdown3G.fillInMDN(CONSTANT.MDNS.NOT_IMPACTED);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptcha3GShutdown();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on the check btn', () => {
        PageObjects.Shutdown3G.clickOnCheckBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on my phone is not working', () => {
        PageObjects.Shutdown3G.clickOnMyPhoneIsNotWorking();
    });
    it('Should scroll down the page', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
    });
    it('Should scroll up and check that the reCaptcha was reset', () => {
        cy.scrollTo('top');
        cy.get('#captcha-box *> iframe').should('not.exist');
    });

});
