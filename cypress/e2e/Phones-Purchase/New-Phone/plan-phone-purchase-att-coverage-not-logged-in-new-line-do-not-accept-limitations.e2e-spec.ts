import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'


describe('Purchase plan & phone - att coverage - not logged in - do not accept limitations', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should click on shop menu', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should add a plan to cart', () => {
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
    });
    it('Should clickon I need a new phone', () => {
        PageObjects.PurchasedPhones.clickOnINeedToBuyAphone();
    });
    it('Should go to phones page', () => {
        PageObjects.TitleExpectations.goToPhonesPage();
    });
    it('Should click on shop iphone', () => {
        PageObjects.PurchasedPhones.clickOnShopIphonePhones();
    });
    it('Should go to phones models page', () => {
        PageObjects.TitleExpectations.goToPhoneModelPage();
    });
    it('Should select 2nd phone', () => {
        PageObjects.PurchasedPhones.clickOnSelect3rdPhone();
   });
   it('Should go to phones phone details page', () => {
        PageObjects.TitleExpectations.goToPhoneDetailsPage();
   });
   it('Should select gray', () => {
        PageObjects.PurchasedPhones.clickOnXSGray();
   });
   it('Should select phone btn', () => {
        PageObjects.PurchasedPhones.clickOnSelecPhoneBtn();
   });
    it('Should go to Service Coverage Check page', () => {
        PageObjects.TitleExpectations.goToServiceCoverageCheckPage();
    });
    it('Should enter an ATT address reference', () => {
        PageObjects.Coverage.enterAddressRefATT();
    });
    it('Should handle the invisible recaptcha here', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on no , I understand - do not accept limitations', () => {
        PageObjects.PurchasedPhones.clickOnNoIamNotIntrested();
    });
    it('Should click on done btn', () => {
        PageObjects.PurchasedPhones.clickOnDoneBtn();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });


});
