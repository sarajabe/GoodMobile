class ManageDevices {

    clickOnProceedToCheckoutBtn() {
        cy.get('[data-cy="proceedToCheckoutButton"]').click();
        return this;
    };
    clickOnChangePhone() {
        cy.get('[data-cy="iHaveNewPhone"]').click();
        return this;
    };
    clickOnAccountSummary() {
        cy.get('#proceedToAccountSummary').click();
        return this;
    };
    clickOnProceedToCheckout() {
        cy.get('[data-cy=proceedToCheckoutButton]').click();
        return this;
    };
    clickOnValidate() {
        cy.get('[data-cy="validateBtn"]').click();
        return this;
    };
    clickOnContactCustomerCare() {
        cy.contains('a', 'contact customer care').click();
        return this;
    };
    clickOnChangePhoneAfterSet() {
        cy.contains('a', 'Change phone').click();
        return this;
    };
    clickOnOkBtn() {
        cy.get('[data-cy="okBtn"]').click();
        return this;
    };

};
export default new ManageDevices();
