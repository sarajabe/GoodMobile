import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('ACP landing page - sign in first - click', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
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
    it('Should click on sign in link', () => {
        PageObjects.Acp.clickOnSignInLink();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
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
    it('Should go to ACP validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
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
    it('Should go to ACP validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
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
    it('Should go to ACP validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
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
    it('Should go to ACP validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
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
