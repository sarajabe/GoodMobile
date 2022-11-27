import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'


describe('remove phone from cart - new mdn - yes check current device', () => {
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
    it('Should fill in zip to check the tmo coverage', () => {
        PageObjects.PurchasedPhones.fillInZipCode(CONSTANT.CODES.TMO_COVERAGE);
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
    it('Should go to checkout page', () => {
        PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
    });
    it('Should click on  existing customer tab', () => {
        PageObjects.HomePage.clickOnExistingCustomerTab();
    });
    it('Should insert valid info for existing customer', () => {
        PageObjects.AccessControl.existingCustomerLogin(CONSTANT.ACCESS.EMPTY_ACCOUNT.EMAIL, CONSTANT.ACCESS.EMPTY_ACCOUNT.PASSWORD);
    });
    it('Should click on continue button in pop up window', () => {
        PageObjects.HomePage.clickOnContinue();
    });
    it('Should the phone model,price, quantity as well the plan quantity from the order details', () => {
        cy.get('.phone-name').should('have.text','iPhone XS 64GB Silver');
        cy.get('.head-desc > :nth-child(2)').should('have.text','$450.00');
        cy.get('.phones-section > :nth-child(1) > .quantity').should('have.text','Quantity: 1');
        cy.get('.plan-quantity').should('have.text','Quantity: 1');
   });
   it('Should go to shipping page', () => {
    PageObjects.TitleExpectations.goToShippingPage();
});
it('Should remove phone from cart', () => {
    PageObjects.PurchasedPhones.removePhoneFromCart();
});
it('Should click on yes from pop up', () => {
    PageObjects.ShippingPage.clickOnYesBtnFromRemoveitemPopUp();
});
it('Should go to Check Compatibility page', () => {
    PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
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
});
it('Should go to compatibility result',  () => {
    PageObjects.TitleExpectations.goToCompatabilityResultPage();
});
it('Should click on proceed to checkout button', () => {
    PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
});
it('Should go to shipping page', () => {
    PageObjects.TitleExpectations.goToShippingPage();
});
it('Should click on remove item from cart', () => {
    PageObjects.ShippingPage.clickOnRemovePlan();
});
it('Should click yes btn from pop up ', () => {
    PageObjects.ShippingPage.clickOnYesBtnFromRemoveitemPopUp();
});
it('Should go to home page', () => {
    PageObjects.TitleExpectations.goToHomePage();
});
    
});
