class Payment {

    selectFirstPaymentMethod() {
        cy.get('[data-cy="paymentMethod"]').first().click();
        return this;
    };
    selectSecondPaymentMethod() {
        cy.get('[data-cy="paymentMethod"]').eq(1).click();
        return this;
    };
    clickOnNextBtn() {
        cy.get('[data-cy="nextBtn"]').click();
        return this;
    };
    clickOnBackBtn() {
        cy.get('[data-cy="backBtn"]').click({force:true});
        return this;
    };
    clickOnSaveBtn() {
        cy.get('[data-cy="saveBtn"]').click();
        return this;
    };
    clickOnAddAnotherCard() {
        cy.get('[data-cy="addAnotherCard"]').click({force:true});
        return this;
    };
    fillInPaymentInfo(nameOnCard,cardNo,CVV) {
        cy.get('[data-cy="fullName"]').clear();
        cy.get('[data-cy="fullName"]').type(nameOnCard);
        cy.get('[data-cy="cardNumber"]').clear();
        cy.get('[data-cy="cardNumber"]').type(cardNo);
        cy.get('[data-cy="cardCode"]').clear();
        cy.get('[data-cy="cardCode"]').type(CVV);
        return this;
    };
    clickOnSameAsShippingAddress() {
        cy.get('.billing-section > .container > .checkmark').click({force:true});
        return this;
    };
    creditCardRequiredValidationMessages(){
        cy.get('[data-cy="requiredNameMsg"]').should('have.text', 'Name on card is required. ');
        cy.get('[data-cy="requiredCardNoMsg"]').should('have.text', 'Card number is required. ');
        cy.get('[data-cy="cvvRequiredMsg"]').should('have.text', 'CVV is required. ');
        cy.get('[data-cy="expiryMonthRequiredMsg"]').should('have.text', ' Expiration month is required ');
        cy.get('[data-cy="expiryYearRequiredMsg"]').should('have.text', ' Expiration year is required ');
    };
    billingAddressRequiredValidationMessages(){
        cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text', 'Address name is a required field');
        cy.get('[data-cy="addressRequiredMsg"]').should('have.text', 'Address is a Required Field');
        cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
        cy.get('[data-cy="stateIsRequired"]').should('have.text', 'State is a Required Field ');
        cy.get('[data-cy="postalIsRequired"]').should('have.text', 'Postal Code is a Required Field');
    };
    creditCardInvalidValidationMessages(){
        cy.get('.checkout-payment-form > :nth-child(2) > .ng-star-inserted').should('have.text', 'Invalid Name. ');
        cy.get('.cvv > .ng-star-inserted').should('have.text', 'CVV is invalid. ');
        cy.get('.no-wrap').should('have.text', ' Expiration date must be valid ');
    };
    billingAddressInvalidValidationMessages(){
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    };
    
};
export default new Payment();
