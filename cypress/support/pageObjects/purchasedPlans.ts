import { CONSTANT } from '../../fixtures/constants/index';
import { PageObjects } from '../../support/pageObjects';

class PurchasedPlans {

    clickOnEditShippingAddressIcon() {
        cy.get('[data-cy="editIcon"]').click();
        return this;
    };

    editShippingInfo(name, address, suite, city, state,postal) {
        cy.get('[data-cy="addressName"]').clear();
        cy.get('[data-cy="addressName"]').type(name);
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="addressLookup"]').type(address);
        cy.get('[data-cy="suiteNo"]').clear();
        cy.get('[data-cy="suiteNo"]').type(suite);
        cy.get('[data-cy="billingCity"]').clear();
        cy.get('[data-cy="billingCity"]').type(city);
        cy.get('[data-cy="billingState"]').clear();
        cy.get('[data-cy="billingState"]').type(state);
        cy.get('[data-cy="billingPostal"]').clear();
        cy.get('[data-cy="billingPostal"]').type(postal);
        cy.get('[data-cy="addressLookup"]').click();
        return this;
    };

    clickOnSaveBtn() {
        cy.get('[data-cy="save"]').click();
        return this;
    };
    clickOnKeepCurrentAddress() {
        cy.get('.display-block > [data-cy="action-button"]').click();
        return this;
    };
    clickOnUseVerifiedAddress() {
        cy.get(':nth-child(3) > [data-cy="action-button"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    clickOnActivatePlanButton() {
        cy.get(':nth-child(1) > .button').click();
        return this;
    };
    purchasePlanWithStorePickupExistingCustomer(){
        PageObjects.HomePage.clickOnShopMenu();
        PageObjects.TitleExpectations.goToPlansGMPage();
        PageObjects.Plans.clickOnCartIcon();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        PageObjects.Coverage.clickOnCheckCoverageBtn();
        PageObjects.Coverage.assertAddressIsRequired();
        PageObjects.Coverage.addressRefNotSelectedFromList();
        PageObjects.Coverage.clickOnCheckCoverageBtn();
        PageObjects.Coverage.assertAddressNotSelectedFromList();
        cy.get('[data-cy="addressRef"]').clear();
        PageObjects.Coverage.enterAddressRefBothCoverages();
        PageObjects.Coverage.clickOnCheckCoverageBtn();
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
        PageObjects.Coverage.clickOnNextStepBtn();
        PageObjects.Compatibility.clickOnCheckYourDevice();
        PageObjects.Compatibility.assertIMEInumberRequired();
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
        PageObjects.Compatibility.assertIMEInumberInvalid();
        PageObjects.Compatibility.clickOnSkipForNowLink();
        PageObjects.Compatibility.clickOnYesFromThePopUp();
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
        PageObjects.ReviewCart.clickOnCheckoutBtn();
        PageObjects.TitleExpectations.goToShippingPage();
        PageObjects.ShippingPage.clickOnStorePickup();
        PageObjects.ShippingPage.barCodeValNotChecked();
        cy.get('#barCodeVal').click();
        PageObjects.ShippingPage.clickOnNextBtn();
        PageObjects.TitleExpectations.goToPaymentPage();
        PageObjects.Payment.clickOnNextBtn();
        PageObjects.Payment.paymentRequired();
        PageObjects.Payment.selectFirstPaymentMethod();
        PageObjects.Payment.clickOnBackBtnAssertExpectedBehavior();
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
        cy.get('[data-cy="deliveryMethod"]').should('have.text', 'Store Pickup');
        PageObjects.PlaceOrder.clickOnSubmitBtn();
        PageObjects.TitleExpectations.goToPurchaseSuccessfulPage();
        cy.get('[data-cy="storePickupSuccessful"]').should('have.text','Your Store pickup barcode is available in your purchased plans page.')
        cy.get('[data-cy="purchasedPlansBtn"]').click();
        PageObjects.TitleExpectations.goToPurchasedPlansPage();
    };
    assertPurchasedPlanWithStorePickupExistingCustomer(){
        PageObjects.AccountSummary.clickOnPurchasedPlans();
        PageObjects.TitleExpectations.goToPurchasedPlansPage();
        cy.get('[data-cy="pendingPlans"]').should('have.text','6GB 4G LTE Plan');
        cy.get('[data-cy="planTitle"]').should('have.text',' Unlimited Talk & text with 6GB Data');
        cy.get('[data-cy="simType"]').should('have.text','SIM Card');
        cy.get('[data-cy="pickupBarCode"]').should('have.text','In-store Pickup Barcode');
        cy.get('[data-cy="barcode"]').should('be.visible');
        cy.get('[data-cy="deliveryOption"]').should('have.text','Store Pickup');
    }
};
export default new PurchasedPlans();
