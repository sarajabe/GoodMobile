import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe('go to to 3g shutdown page and insert an impacted mdn', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on 3G shutdown', () => {
        PageObjects.Footer.clickOn3GShutdown();
    });
    it('Should go to 3G shutdown page', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
    });
    it('Should fill the input field with an impacted mdn', () => {
        PageObjects.Shutdown3G.fillInMDN(CONSTANT.MDNS.IMPACTED);
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
    it('Should click on go back to 3g shutdown page btn from the pop up', () => {
        PageObjects.Shutdown3G.clickOnGoBackto3GShutdownPage();
    });
    it('Should stay in 3G shutdown page and scroll up to the check the recapcta reset', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
        cy.scrollTo('top');
        cy.get('#captcha-box *> iframe').should('not.exist');
    });
    it('Should fill the input field with an impacted mdn again', () => {
        PageObjects.Shutdown3G.fillInMDN(CONSTANT.MDNS.IMPACTED);
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
    it('Should stay in 3G shutdown page and scroll up to check that the recapcta was reset', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
        cy.scrollTo('top');
        cy.get('#captcha-box *> iframe').should('not.exist');
    });
});
