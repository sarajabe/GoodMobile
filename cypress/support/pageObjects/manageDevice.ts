class ManageDevices {

    clickOnProceedToCheckoutBtn() {
        cy.get('[data-cy="proceedToCheckoutButton"]').click();
        return this;
    };
    clickOnCheckAnotherDevice() {
        cy.get('[data-cy="check-another-device"]').click();
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
    clickOnGotItBtn() {
        cy.get('[data-cy="gorItBtn"]').click();
        return this;
    };
    clickOnGetReplacementSIM() {
        cy.get('[data-cy="getReplacementSIM"]').click();
        return this;
    };
};
export default new ManageDevices();
