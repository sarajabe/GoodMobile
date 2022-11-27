import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('ACP landing page - not signed in', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on ACP from footer', () => {
        PageObjects.Footer.clickOnACP();
    });
    it('Should go to acp ladning page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on apply now btn', () => {
        PageObjects.Acp.clickOnApplyNowBtn();
    });
    it('Should go to ACP - signup page', () => {
        PageObjects.TitleExpectations.goToACPSignUpPage();
    });
    it('Should insert valid info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA2.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.CONFIRMED_PASS);
    });
    it('Should check the reCaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo1();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should go to ACP validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
    });
    it('Should log out', () => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on ACP from footer', () => {
        PageObjects.Footer.clickOnACP();
    });
    it('Should go to acp ladning page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on get starting btn', () => {
        PageObjects.Acp.clickOnGetStarted();
    });
    it('Should go to ACP - signup page', () => {
        PageObjects.TitleExpectations.goToACPSignUpPage();
    });
    it('Should insert valid info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA2.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.CONFIRMED_PASS);
    });
    it('Should check the reCaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo1();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should go to ACP validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
    });
    it('Should log out', () => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on ACP from footer', () => {
        PageObjects.Footer.clickOnACP();
    });
    it('Should go to acp ladning page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on start here btn', () => {
        PageObjects.Acp.clickOnStartHere();
    });
    it('Should go to ACP - signup page', () => {
        PageObjects.TitleExpectations.goToACPSignUpPage();
    });
    it('Should insert valid info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA2.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.CONFIRMED_PASS);
    });
    it('Should check the reCaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo1();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should go to ACP validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
    });
    it('Should log out', () => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on ACP from footer', () => {
        PageObjects.Footer.clickOnACP();
    });
    it('Should go to acp ladning page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on start here btn', () => {
        PageObjects.Acp.cllickOnApplyNowFrom3StepsSection();
    });
    it('Should go to ACP - signup page', () => {
        PageObjects.TitleExpectations.goToACPSignUpPage();
    });
    it('Should insert valid info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA2.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA2.CONFIRMED_PASS);
    });
    it('Should check the reCaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo1();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on submit', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should go to ACP validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
    });
    it('Should log out', () => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on ACP from footer', () => {
        PageObjects.Footer.clickOnACP();
    });
    it('Should go to acp ladning page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on start here btn', () => {
        PageObjects.Acp.clickOnMoreFaqs();
    });
    it('Should stay in same page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
});
