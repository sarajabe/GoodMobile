import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe('Coverage & Device check - ATT IMEI', () => {
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
    it('Should select plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    // Both TMO & ATT coverage - ATT IMEI
    it('Should enter covered address on both ATT & TMO', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert that the address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number - ATT', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.ATT_ONLY.ATT1);
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it('Should go to Compatability Result page', () => {
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
    });
    it('Should assert the congrats message', () => {
        cy.get('[data-cy="compatibilityResult"]').should('have.text', ' Congrats!');
    });
    it('Should click on proceed to checkout', () => {
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPlansPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should assert the SIM card type to be physical SIM', () => {
        cy.get('[data-cy="simType-CartItems"]').should('have.text', 'SIM Card');
    });
    it('Should empty the cart', () => {
        PageObjects.ReviewCart.clickOnEmptyCart();
    });
    it('Should confirm emptying cart from the pop up', () => {
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
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
    it('Should select plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    // ATT Coverage - ATT IMEI
    it('Should enter covered address - ATT', () => {
        PageObjects.Coverage.enterAddressRefATTCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert that address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number - ATT', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.ATT_ONLY.ATT1);
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it('Should go to Compatability Result page', () => {
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
    });
    it('Should assert the congrats message', () => {
        cy.get('[data-cy="compatibilityResult"]').should('have.text', ' Congrats!');
    });
    it('Should click on proceed to checkout', () => {
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPlansPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should assert the SIM card type to be physical SIM', () => {
        cy.get('[data-cy="simType-CartItems"]').should('have.text', 'SIM Card');
    });
    it('Should empty the cart', () => {
        PageObjects.ReviewCart.clickOnEmptyCart();
    });
    it('Should confirm emptying cart from the pop up', () => {
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
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
    it('Should select plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    // TMO Coverage - ATT IMEI
    it('Should enter covered address - TMO', () => {
        PageObjects.Coverage.enterAddressRefTMOCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert that the address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number - ATT', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.ATT_ONLY.ATT1);
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it(`Should stay in Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should assert that the device is incompatibile', () => {
        cy.get('.banner-content > .title').should('have.text', ' We are sorry!');
    });
    // ATT adress - esim imei
    it('Should click on shop menu', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter covered address - TMO', () => {
        PageObjects.Coverage.enterAddressRefATTCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert that the address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number - ESIM', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.ESIM_IPHONE.ESIM1);
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it('Should assert that the iPhone 14 Pro is eSIM only and the network that supports eSIM does not have sufficient coverage', () => {
        cy.get('.banner-content > .title').should('have.text', ' Sorry!');
    });
    it('Should click on check another device btn', () => {
        PageObjects.Compatibility.clickOnCheckAgain();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });

   
});