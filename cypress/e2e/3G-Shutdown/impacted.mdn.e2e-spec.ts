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
    it('Should fill the input field with an nvalid mdn', () => {
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
    it('Should click on see what phone modals will work btn from the pop up', () => {
        PageObjects.Shutdown3G.clickOnSeewhatPhoneModalsWillWork();
    });
    it('Should stay in 3G shutdown page and scroll down to the check my device section', () => {
        PageObjects.TitleExpectations.goTo3gShutdownPage();
        cy.get('[data-cy="enterDeviceIMEI"]').should('be.visible');
    });

});
