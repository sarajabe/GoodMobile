import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Select plan as existing - ATT - physical sim - Add/Change shipping address', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
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
    it('Should assert that the address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IMEI number - ATT', () => {
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
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
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
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('should click on add a new address ', () => {
        PageObjects.ShippingPage.clickOnAddNewAddress();
    });
    it('should fill in shipping info - MILITARY ADDRESS ', () => {
        PageObjects.ShippingPage.fillInShippingInfo(CONSTANT.SHIPPING.MILITARY_ADDRESS.NAME,
            CONSTANT.SHIPPING.MILITARY_ADDRESS.ADDRESS1,
            CONSTANT.SHIPPING.MILITARY_ADDRESS.CITY,
            CONSTANT.SHIPPING.MILITARY_ADDRESS.STATE,
            CONSTANT.SHIPPING.MILITARY_ADDRESS.POSTAL);
            cy.get('[data-cy="addressName"]').click();
    });
    it('should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSave();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('should assert that a pop up for verifying address appeared', () => {
        cy.get('.modal-heading').should('have.text','Verify your shipping address');
    });
    it('should close pop up', () => {
        PageObjects.ShippingPage.clickOnIconCloseFromPopUp();
    });
    it('should fill in shipping info - PoBox ADDRESS ', () => {
        PageObjects.ShippingPage.fillInShippingInfo(CONSTANT.SHIPPING.PO_BOX_ADDRSS.NAME,
            CONSTANT.SHIPPING.PO_BOX_ADDRSS.ADDRESS1,
            CONSTANT.SHIPPING.PO_BOX_ADDRSS.CITY,
            CONSTANT.SHIPPING.PO_BOX_ADDRSS.STATE,
            CONSTANT.SHIPPING.PO_BOX_ADDRSS.POSTAL);
            cy.get('[data-cy="addressName"]').click();
    });
    it('should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSave();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('should assert that a pop up for verifying address appeared', () => {
        cy.get('.modal-heading').should('have.text','Verify your shipping address');
    });
    it('should close pop up', () => {
        PageObjects.ShippingPage.clickOnIconCloseFromPopUp();
    });
    it('should fill in shipping info - NORMAL ADDRESS', () => {
        PageObjects.ShippingPage.fillInShippingInfo(CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.NAME,
            CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.SHIPPING_ADDRESS,
            CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.CITY,
            CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.STATE,
            CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.POSTAL);
            cy.get('[data-cy="addressName"]').click();
    });
    it('should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSave();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on use verified address', () => {
        PageObjects.ShippingPage.clickOnUseVerifiedAddress();
    });
    it('should assert the initial address', () => {
        cy.get(':nth-child(1) > .details > label.ng-tns-c204-6 > .ng-tns-c204-6').should('have.text','Mock G');
    });
    it('should select shipping service and delivery options', () => {
        cy.get('select').eq(1).select('Usps', { force: true }).should('have.value', 'usps');
        cy.get('select').eq(2).select('First Class Mail Shipping 3-7 Business days', { force: true }).should('have.value', 'usps_first_class_mail/letter');
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should select payment method', () => {
        PageObjects.Payment.selectFirstPaymentMethod();
    });
    it('should click on next', () => {
        PageObjects.Payment.clickOnNextBtn();
    });
    it('Should go to place order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('should click change address', () => {
        PageObjects.PlaceOrder.clickOnChangeShippingAddress();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('should click on add a new address', () => {
        PageObjects.ShippingPage.clickOnAddNewAddress();
    });
    it('should fill in shipping info', () => {
        PageObjects.ShippingPage.fillInShippingInfo(CONSTANT.SHIPPING.SHIPPING_DATA2.NAME,
            CONSTANT.SHIPPING.SHIPPING_DATA2.ADDRESS1,
            CONSTANT.SHIPPING.SHIPPING_DATA2.CITY,
            CONSTANT.SHIPPING.SHIPPING_DATA2.STATE,
            CONSTANT.SHIPPING.SHIPPING_DATA2.POSTAL);
            cy.get('[data-cy="addressName"]').click();
    });
    it('should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSave();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on use verified address', () => {
        PageObjects.ShippingPage.clickOnUseVerifiedAddress();
    });
    it('should assert that the new address was saved', () => {
        cy.get(':nth-child(1) > .details > label.ng-tns-c204-8 > .ng-tns-c204-8').should('have.text','William Bawwab');
    });
    it('should assert that the shipping service and deliveray options selected', () => {
        cy.get('select').eq(1).should('have.text','Shipping Service Usps ');
        cy.get('select').eq(2).should('have.text','Delivery Options First Class Mail Shipping 3-7 Business days  Priority Mail 2-3 Business days with tracking provided by USPS.  Priority Mail Express 1-2 Business days with tracking provided by USPS. ');
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should go to place order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('should delete the plan', () => {
        PageObjects.PlaceOrder.deletePlan();
    });
    it('should click on yes from the pop up', () => {
        PageObjects.PlaceOrder.clickOnYesFromThePopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });

});
