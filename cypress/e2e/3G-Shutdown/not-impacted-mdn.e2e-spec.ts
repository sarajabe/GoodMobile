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
    it('Should fill the input field with an not impacted mdn', () => {
        PageObjects.Shutdown3G.fillInMDN(CONSTANT.MDNS.NOT_IMPACTED);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptcha3GShutdown();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on the check btn', () => {
        PageObjects.Shutdown3G.clickOnCheckBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on go to my account summary btn from the pop up', () => {
        PageObjects.Shutdown3G.clickOnGoToMyAccountSummaryNtn();
    });
    it('Should login page to sign in first', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });

});
