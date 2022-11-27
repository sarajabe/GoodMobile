class ProfileSettings {

  clickOnEditAddress() {
    cy.get('[data-cy="action-button"]').click();
    return this;
  };
  clickOnMakeDefaultPayment() {
    cy.get('.action > .button').click();
    return this;
  };
  clickOnChangePayment() {
    cy.get('#changePayment-0').click();
    return this;
  };
  clickOnUpdateButton() {
    cy.contains('button[title="Update"]').click();
    return this;
  };
  clickOnEditAddressIcon() {
    cy.get('#editAddressIcon-0').click();
    return this;
  };
  clickOnSaveEmailChange() {
    cy.get('[data-cy=saveEmailButton]').click();
    return this;
  };
  clickOnOkConfirmPasswordFromPopUp() {
    cy.get('.twelve > .primary').click();
    return this;
  };
  clickOnSaveNameChange() {
    cy.get('[data-cy="save-name"]').click();
    return this;
  };
  clickOnSaveShippingInfo() {
    cy.get('[data-cy="save"]').click();
    return this;
  };
  clickOnCloseIcon() {
    cy.get('.icon-close').click();
    return this;
  };
  fillInConfirmPassword(confirmPassword) {
    cy.get('[data-cy="confirmCurrentPassword"]').clear();
    cy.get('[data-cy="confirmCurrentPassword"]').type(confirmPassword);
    return this;
  };
  clickOnCanCelNameChange() {
    cy.get('[data-cy=cancel-edit-name]').click();
    return this;
  };
  clickOnCancelEmailChange() {
    cy.get('[data-cy=cancelEmailButton]').click();
    return this;
  };
  clickOnChangeEmail() {
    cy.get('[data-cy=changeEmail]').click();
    return this;
  };
  clickOnChangeName() {
    cy.get('[data-cy=changeName]').click();
    return this;
  };
  clickOnUpdatePaymentMethodButton() {
    cy.get('.modal-actions > .button').click();
    return this;
  };
  clickOnEditPaymentIcon() {
    cy.get('#editPaymentIcon-0').click();
    return this;
  };
  clickOnSavePasswordChanges() {
    cy.get('[data-cy=savePasswordButton]').click();
    return this;
  };
  clickOnCancelPasswordChanges() {
    cy.get('[data-cy="cancelPasswordButton"]').click();
    return this;
  };
  clickOnChangePassword() {
    cy.get('[data-cy=changePassword]').click();
    return this;
  };
  clickOnSaveNewPayment() {
    cy.get('[data-cy="SaveNewPayment"]').click();
    return this;
  };
  clickOnAllPaymentsMethod() {
    cy.get('[data-cy="allPaymentsMethod"]').click();
    return this;
  };
  clickOnSaveButtonFromPopUp() {
    cy.get('[data-cy="confirm-btn"]').click();
    return this;
  };
  clickOnAddAnotherPayment() {
    cy.get('[data-cy=addAnotherPayment]').click();
    return this;
  };
  clickOnEditPaymentAddress() {
    cy.get('[data-cy="editPaymentAddress"]').click();
    return this;
  };
  clickOnSaveButton() {
    cy.get('[data-cy="saveAddressBtn"]').click();
    return this;
  };
 clickOnRemovePayment() {
  cy.get('#removePaymentIcon-0').click();
    return this;
  };
  clickOnRemoveAddressMethod() {
    cy.get('.desktop > #removeAddress-2 > .ng-tns-c17-4').click({force:true});
    return this;
  };
  clickOnAllAdressesInBook() {
    cy.get('[data-cy="allAddressesInBook"]').click({force:true});
    return this;
  };
  clickOnSaveNewAddress() {
    cy.get(':nth-child(3) > .button').click();
    return this;
  };
  clickOnAddAnotherAddress() {
    cy.get('[data-cy="addAnotherAddress"]').click();
    return this;
  };
  changePassword(currentPassword, newPassword) {
    cy.get('[data-cy=currentPassword]').clear();
    cy.get('[data-cy=password]').clear();
    cy.get('[data-cy=currentPassword]').type(currentPassword);
    cy.get('[data-cy=password]').type(newPassword);
    return this;
  };
  changeName(firstName, secondName) {
    cy.get('[data-cy=firstName]').clear();
    cy.get('[data-cy=lastName]').clear();
    cy.get('[data-cy=firstName]').type(firstName);
    cy.get('[data-cy=lastName]').type(secondName);
    return this;
  };
  changeEmail(email) {
    cy.get('[data-cy=email]').clear();
    cy.get('[data-cy=email]').type(email);
    return this;
  };
  addBillingInfo1(billingAddress, billingSuiteNoNo) {
    cy.get('[data-cy=addressLookup]').clear();
    cy.get('[data-cy=addressLookup]').type(billingAddress);
    cy.get('[data-cy=address2]').clear();
    cy.get('[data-cy=address2]').type(billingSuiteNoNo);
    return this;
  };
  clickOnNoBtnFromDeletePaymentPopUp() {
      cy.get('[data-cy="cancel-btn"]').click();
      return this;
  };
  clickOnProfileSettingsFromAccountMenu() {
    cy.get('[data-cy="account-menu-header"]').click({force: true});
    cy.get('[data-cy="profile-setting-header"]').click({force: true});
    return this;
  };
  addPaymentAssertRequiredValidationMessages() {
    cy.get('[data-cy="invalidCreditCardMsg"]').should('have.text','Invalid Credit Card Number. ');
    cy.get('[data-cy="nameOnCardRequiredMsg"]').should('have.text','Name on card is required. ');
    cy.get('[data-cy="cvvRequiredMsg"]').should('have.text','CVV is required field. ');
    cy.get('[data-cy="expiryMonthRequiredMsg"]').should('have.text',' Expiration month is required ');
    cy.get('[data-cy="expiryYearRequiredMsg"]').should('have.text',' Expiration year is required ');
    cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text','Address alias is required field');
    cy.get('[data-cy="addressRequiredMsg"]').should('have.text','Address is a Required Field');
    cy.get('[data-cy="cityIsRequired"]').should('have.text','City is a Required Field');
    cy.get('[data-cy="stateIsRequired"]').should('have.text','State is a Required Field ');
    cy.get('[data-cy="postalIsRequired"]').should('have.text','Postal Code is a Required Field');
  }
  addPaymentAssertInvalidValidationMessages() {
    cy.get('[data-cy=cardNumber]').should('be.visible');
    cy.get('[data-cy="invalidName"]').should('have.text','Invalid name. ');
    cy.get('[data-cy="cvvInvalidMsg"]').should('have.text','CVV is invalid. ');
    cy.get('[data-cy="invalidCityMsg"]').should('have.text','Invalid City ');
    cy.get('[data-cy="invalidStateMsg"]').should('have.text','Invalid State ');
    cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text','Invalid Postal Code ');
  }
  editPaymentAssertRequiredValidationMessages() {
    cy.get('[data-cy="nameOnCardRequiredMsg"]').should('have.text', ' Name on card is required. ');
    cy.get('[data-cy="cvvRequiredMsg"]').should('have.text', ' CVV is required. ');
    cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text', ' Name is required. ');
    cy.get('[data-cy="addressLineRequiredMsg"]').should('have.text', ' Address is required. ');
    cy.get('[data-cy="stateRequiredMsg"]').should('have.text', ' State is required. ');
    cy.get('[data-cy="cityRequiredMsg"]').should('have.text', ' City is required. ');
    cy.get('[data-cy="zipRequiredMsg"]').should('have.text', ' ZIP code is required. ');
  }
  editPaymentAssertInvalidValidationMessages() {
    cy.get('[data-cy="invalidName"]').should('have.text', ' Invalid Name. ');
    cy.get('[data-cy="cvvInvalidMsg"]').should('have.text', ' CVV is invalid. ')
    cy.get('[data-cy="stateInvalidMsg"]').should('have.text', ' State is invalid. ');
    cy.get('[data-cy="cityInvalidMsg"]').should('have.text', ' City is invalid. ');
    cy.get('[data-cy="zipInvalidMsg"]').should('have.text', ' ZIP code is invalid. ');
  }
};
export default new ProfileSettings();
