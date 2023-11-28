class BillingPage {

    addPaymentInfo(pan, NameOnCard, CVV) {
        cy.get('[data-cy=cardNumber]').clear();
        cy.get('[data-cy=cardNumber]').type('4111111111111111');
        cy.get('[data-cy=cardNumber]').type('1111111111111111');
        cy.get('[data-cy=cardNumber]').type('1111111111111111');
        cy.get('[data-cy=cardNumber]').type('1111111111111111');
        cy.get('[data-cy=fullName]').clear();
        cy.get('[data-cy=fullName]').type(NameOnCard);
        cy.get('[data-cy=cardCode]').clear();
        cy.get('[data-cy=cardCode]').type(CVV);
        return this;
    };
    addPaymentInfoForShipping(pan, CVV,NameOnCard) {
        cy.get('[data-cy=cardNumber]').clear();
        cy.get('[data-cy=cardNumber]').type('4111111111111111');
        cy.get('[data-cy=cardNumber]').type('1111111111111111');
        cy.get('[data-cy=cardNumber]').type('1111111111111111');
        cy.get('[data-cy=cardNumber]').type('1111111111111111');
        cy.get('[data-cy=cardCode]').clear();
        cy.get('[data-cy=cardCode]').type(CVV);
        cy.get('[data-cy=fullName]').clear();
        cy.get('[data-cy=fullName]').type(NameOnCard);
        return this;
    };
    addDate() {
        cy.get('select').eq(1).select('02', { force: true }).should('have.value', '02');
        cy.get('select').eq(2).select('28', { force: true }).should('have.value', '28');
        return this;
    };
    editPaymentInfo(Name, CVV) {
        cy.get('[data-cy="nameField"]').clear();
        cy.get('[data-cy="nameField"]').type(Name);
        cy.get('[data-cy="cardCodeField"]').clear();
        cy.get('[data-cy="cardCodeField"]').type(CVV);
        return this;
      };
      editPaymenAddresstInfo(addressName, addressLine, state, city,zip) {
          cy.get('[data-cy="addressNameField"]').click();
          cy.get('[data-cy="addressNameField"]').clear();
          cy.get('[data-cy="addressNameField"]').type(addressName);
          cy.get('[data-cy="addressLookup"]').click();
          cy.get('[data-cy="addressLookup"]').clear();
          cy.get('[data-cy="addressLookup"]').type(addressLine);
          cy.get('[data-cy="stateField"]').click();
          cy.get('[data-cy="stateField"]').clear();
          cy.get('[data-cy="stateField"]').type(state);
          cy.get('[data-cy="cityField"]').click();
          cy.get('[data-cy="cityField"]').clear();
          cy.get('[data-cy="cityField"]').type(city);
          cy.get('[data-cy="zipField"]').click();
          cy.get('[data-cy="zipField"]').clear();
          cy.get('[data-cy="zipField"]').type(zip);
        return this;
      };
    addYear() {
        cy.get('select').eq(0).select('12', { force: true }).should('have.value', '12');
        return this;
    };
    addMonth() {
        cy.get('select').eq(1).select('30', { force: true }).should('have.value', '30');
        return this;
    };
    addBillingInfo1(billingName, billingAddress, billingSuiteNo) {
        cy.get('[data-cy="addressName"]').clear({ force: true });
        cy.get('[data-cy="addressName"]').type(billingName);
        cy.get('[data-cy="addressLookup"]').clear({ force: true });
        cy.get('[data-cy="addressLookup"]').type(billingAddress);
        cy.get('.mat-option-text').first().click();
        cy.get('[data-cy="suiteNo"]').clear({ force: true });
        cy.get('[data-cy="suiteNo"]').type(billingSuiteNo);
        return this;
    };
    addBillingInfo2(billingCity, billingState, billingPostal) {
        cy.get('[data-cy="billingCity"]').clear({ force: true });
        cy.get('[data-cy="billingCity"]').type(billingCity);
        cy.get('[data-cy=billingState]').clear({ force: true });
        cy.get('[data-cy=billingState]').type(billingState);
        cy.get('[data-cy="billingPostal"]').clear({ force: true });
        cy.get('[data-cy="billingPostal"]').type(billingPostal);
        cy.get('[data-cy="billingCity"]').click({ force: true });
        return this;
    };
    selectPaymentMethod() {
        cy.get('.radio-option').first().click();
        return this;
    };
    choseBillingAddressSameAsShipping() {
        cy.get('.billing-check > .container > .checkmark').click();
        return this;
    };
    clickOnContinueBilling() {
       cy.get('[data-cy="continue-shipping"]').click({force: true});
        return this;
    };
    clickOnAddAnotherCard() {
        cy.contains('Add a payment card').click();
        return this;
    };
    clickOnYesRemoveItemFromPopUp() {
        cy.get('[data-cy="confirm-btn"]').click();
        return this;
    };
    clickOnbillingAddressSameAsShippingAddress() {
        cy.get('.label[for="sameAddressAsShipping').trigger('mouseover').click();
        return this;
    };
    clickOnDoYouHaveAvoucher() {
        cy.contains('span', 'Do you have a voucher?').click();
        return this;
    };
    fillVoucher(voucher) {
        cy.get('[data-cy=voucherCode]').clear();
        cy.get('[data-cy=voucherCode]').type(voucher);
        cy.contains('button[title="Validate"]').click();
        return this;
    };
    addPaymentInfoProcess(pan, NameOnCard, CVV) {
        cy.get('[data-cy=cardNumber]').clear();
        cy.get('[data-cy=cardNumber]').type(pan);
        cy.get('[data-cy=fullName]').clear();
        cy.get('[data-cy=fullName]').type(NameOnCard);
        cy.get('[data-cy=cardCode]').clear();
        cy.get('[data-cy=cardCode]').type(CVV);
        return this;
    };
};
export default new BillingPage();
