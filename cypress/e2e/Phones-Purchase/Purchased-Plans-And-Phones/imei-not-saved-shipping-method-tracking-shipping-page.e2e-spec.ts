import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'

describe('purchase phone - imei not saved - track shipping method - remove device from shipping page', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on shop menu', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on phones', () => {
        PageObjects.HomePage.clickOnPhones();
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
    it('Should select 3rd phone', () => {
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
    it('Should sclick on add a new line', () => {
        PageObjects.PurchasedPhones.clickOnAddANewLine();
    });
    it('Should go to select line page', () => {
        PageObjects.TitleExpectations.goToSelectLinePage();
    });
    it('Should sclick on next', () => {
        PageObjects.PurchasedPhones.clickOnNextBtn();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select plan', () => {
        cy.get('#select-plan-GOOD2GO-20GB-50').click();
    });
    it('Should go to Service Coverage Check page', () => {
        PageObjects.TitleExpectations.goToServiceCoverageCheckPage();
    });
    it('Should enter a TMO address reference', () => {
        PageObjects.Coverage.enterAddressRefTMO();
    });
    it('Should handle the invisible recaptcha here', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on done btn', () => {
        PageObjects.PurchasedPhones.clickOnDoneBtn();
    });
    it('Should go to checkout new customer', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
    });
    it('Should insert valid info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.CONFIRMED_PASS);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on continue to  sign up ', () => {
        PageObjects.AccessControl.clickOnContinueSignUpBtn();
    });
    it('Should click on continue button in pop up window', () => {
        PageObjects.HomePage.clickOnContinue();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should make sure that the shipping method is Fedex', () => {
        cy.get('[data-cy="shippingMethod"]').first().should('have.text', 'Fedex Ground Shipping 3 to 5 Business days');
    });
    it('Should the phone model,price, quantity from the order details', () => {
        cy.get('.phone-name').should('have.text', 'iPhone 12 64GB Red');
        cy.get('.head-desc > :nth-child(2)').should('have.text', '$620.00');
        cy.get('.phones-section > :nth-child(1) > .quantity').should('have.text', 'Quantity: 1');
    });
    it('Should remove phone from cart', () => {
        PageObjects.PurchasedPhones.removePhoneFromCart();
    });
    it('Should click on yes from pop up', () => {
        PageObjects.ShippingPage.clickOnYesBtnFromRemoveitemPopUp();
    });
    it('Should go to check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number and address reference', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_ATT);
        PageObjects.Compatibility.enterAddressRef();
        cy.get('[data-cy=equipmentNumber]').click();
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check phone button', () => {
        PageObjects.Compatibility.clickOnCheckPhoneButton();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should go to compatibility result page', () => {
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
    });
    it('Should click on proceed to checkout button', () => {
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
    });
    it('Should check that the shipping method is not Fedex', () => {
        cy.get('[data-cy="shippingMethod"]').first().should('not.have.text', ' Fedex Ground Shipping 3 to 5 Business days ');
        cy.get('[data-cy="shippingMethod"]').first().should('have.text', 'First Class Mail Shipping 3-7 Business days');
        cy.get('[data-cy="shippingMethodOrderCard"]').should('have.text','First Class Mail Shipping 3-7 Business days');
    });

});

