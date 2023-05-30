import { CONSTANT } from "../../fixtures/constants";

class ShippingPage {
    editShippingAddress(addressName, shippingAddressField, suiteNumber, city, state, postal) {
        cy.get('[data-cy="addressName"]').clear();
        cy.get('[data-cy="addressName"]').type(addressName);
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="addressLookup"]').type(shippingAddressField);
        cy.get('[data-cy="suiteNo"]').clear();
        cy.get('[data-cy="suiteNo"]').type(suiteNumber);
        cy.get('[data-cy="billingCity"]').clear();
        cy.get('[data-cy="billingCity"]').type(city);
        cy.get('[data-cy="billingState"]').clear();
        cy.get('[data-cy="billingState"]').type(state);
        cy.get('[data-cy="billingPostal"]').clear();
        cy.get('[data-cy="billingPostal"]').type(postal);
        return this;
    }; 
    planTitle() {
        cy.get(':nth-child(2) > .title');
        return this;
    };
    clickOnRemovePlan() {
        cy.get('.actions-container.ng-star-inserted > :nth-child(2)').click();
        return this;
    };
    clickOnRemoveOrder() {
        cy.get('.actions-container > :nth-child(2)').click();
        return this;
    };
    clickOnYesBtn() {
        cy.get('.modal-actions > .primary').click();
        return this;
    };
    addAddressInfo1(name, shippingAddressField, suiteNumber) {
        cy.get('[data-cy="alias"]').clear();
        cy.get('[data-cy="alias"]').type(name);
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="addressLookup"]').type(shippingAddressField);
        cy.get('[data-cy="suiteNo"]').click();
        cy.get('[data-cy="suiteNo"]').clear();
        cy.get('[data-cy="suiteNo"]').type(suiteNumber);
        return this;
    };
    addShippingInfo1(name, shippingAddress, suiteNumber) {
        cy.get('[data-cy="addressName"]').click({ force: true });
        cy.get('[data-cy="addressName"]').clear();
        cy.get('[data-cy="addressName"]').type(name);
        cy.get('[data-cy="addressLookup"]').click({ force: true });
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="addressLookup"]').type(shippingAddress);
        cy.get('.mat-option-text').first().click();
        cy.get('[data-cy="suiteNo"]').click({ force: true });
        cy.get('[data-cy="suiteNo"]').clear();
        cy.get('[data-cy="suiteNo"]').type(suiteNumber);
        return this;
    };
    addInvalidShippingInfo1(name, shippingAddress, suiteNumber) {
        cy.get('[data-cy="addressName"]').click({ force: true });
        cy.get('[data-cy="addressName"]').clear();
        cy.get('[data-cy="addressName"]').type(name);
        cy.get('[data-cy="addressLookup"]').click({ force: true });
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="addressLookup"]').type(shippingAddress);
        cy.get('[data-cy="suiteNo"]').click({ force: true });
        cy.get('[data-cy="suiteNo"]').clear();
        cy.get('[data-cy="suiteNo"]').type(suiteNumber);
        return this;
    };
    addShippingInfo2(city, state, postal) {
        cy.get('[data-cy="billingCity"]').clear();
        cy.get('[data-cy="billingCity"]').type(city);
        cy.get('[data-cy="billingState"]').clear();
        cy.get('[data-cy="billingState"]').type(state);
        cy.get('[data-cy="billingPostal"]').clear();
        cy.get('[data-cy="billingPostal"]').type(postal);
        cy.get('[data-cy="billingCity"]').click();
        return this;
    };
    chooseVerifiedAddress() {
        cy.get('.transparent').click({ force: true });
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
        return this;
    };
    chooseKeepCurrentAddress() {
        cy.get(':nth-child(3) > [data-cy="action-button"]').click({ force: true });
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
        return this;
    };
    selectShippingInfo() {
        cy.get('[data-cy="shippingAddress"]').first().click();
        return this;
    };
    selectSecondShippingInfo() {
        cy.get('[data-cy="shippingAddress"]').eq(1).click();
        return this;
    };
    clickOnSaveBtn() {
        cy.get('[data-cy="saveBtn"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    clickOnNextBtn() {
        cy.get('[data-cy="nextBtn"]').click();
        return this;
    };
    clickOnContinueShipping() {
        cy.get('[data-cy="continue-shipping"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
        return this;
    };
    clickOnYesBtnFromRemoveitemPopUp() {
        cy.get('[data-cy="confirm-btn"]').click();
        return this;
    };
    clickOnCancelBtnFromRemoveitemPopUp() {
        cy.get('[data-cy="cancel-btn"]').click();
        return this;
    };
    clickOnIconCloseFromPopUp() {
        cy.get('.icon-close').click();
        return this;
    };
    clickOnBackBtn() {
        cy.get('[data-cy="backBtn"]').click({force:true});
        return this;
    }
    clickOnAddNewAddress() {
        cy.get('[data-cy="addNewAddress"]').click();
        return this;
    };
    fillInShippingInfo(addressName, address, billingCity,billingState,billingPostal) {
        cy.get('[data-cy="addressName"]').clear();
        cy.get('[data-cy="addressName"]').type(addressName);
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="addressLookup"]').type(address);
        cy.get('[data-cy="billingCity"]').clear();
        cy.get('[data-cy="billingCity"]').type(billingCity);
        cy.get('[data-cy="billingState"]').clear();
        cy.get('[data-cy="billingState"]').type(billingState);
        cy.get('[data-cy="billingPostal"]').clear();
        cy.get('[data-cy="billingPostal"]').type(billingPostal);
        
        return this;
    };
    clickOnUseVerifiedAddress() {
        cy.get('.left > [data-cy="action-button"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    clickOnSave() {
        cy.get('[data-cy="saveBtn"]').click({force:true});
        return this;
    };
    clickOnHomeDelivery(){
        cy.get('[data-cy="homeDelivery"]').click();
    }
    clickOnStorePickup(){
        cy.get('[data-cy="storePickup"]').click();
    }
    barCodeValNotChecked(){
        cy.get('#barCodeVal').should('not.be.checked');
        cy.get('[data-cy="nextBtn"]').blur;
    }
    assertInvalidShippingAddress(){
        cy.get('[data-cy="addressNameInvalidMsg"]').should('have.text','Name is invalid');
        cy.get('[data-cy="invalidCityMsg"]').should('have.text','Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text','Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text','Invalid Postal Code ');
    };
    selectShippingAndFreeDelivery(){
        cy.get('select').eq(0).select('USPS', { force: true }).should('have.value', 'usps');
        cy.get('select').eq(1).select('First Class Mail Shipping 3-7 Business days', { force: true }).should('have.value', 'usps_first_class_mail/letter');
    };
};
export default new ShippingPage();
