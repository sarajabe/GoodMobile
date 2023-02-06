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
