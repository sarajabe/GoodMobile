import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe(' go to to 3g shutdown page and insert an invalid mdn', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on 3G shutdown', () => {
        PageObjects.Footer.clickOn3GShutdown();
    });
    it('Should go to 3G shutdown page', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
    });
    it('Should fill the input field with an nvalid mdn', () => {
        PageObjects.Shutdown3G.fillInMDN(CONSTANT.MDNS.INVALID);
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
    it('Should click on got it btn from the pop up of invalid mdn', () => {
        PageObjects.Shutdown3G.clickOnGotItBtn();
    });
    it('Should stay in page, scroll up and then make sure that the reCaptcha was reset', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
        cy.scrollTo('top');
        cy.get('#captcha-box *> iframe').should('not.exist');
    });


});
