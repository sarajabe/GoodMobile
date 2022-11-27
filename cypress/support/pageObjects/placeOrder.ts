class PlaceOrder {

    clickOnSubmitBtn() {
        cy.get('[data-cy="submitBtn"]').click();
        return this;
    };
    clickOnBackBtn() {
        cy.get('[data-cy="backBtn"]').click();
        return this;
    };
    clickOnChangeShippingAddress() {
        cy.get('[data-cy="changeShippingAddress"]').click();
        return this;
    };
    deletePlan() {
        cy.get('[data-cy="deletePlan"]').click();
        return this;
    };
    clickOnYesFromThePopUp() {
        cy.get('[data-cy="confirm-btn"]').click();
        return this;
    };
    clickOnChangePyment() {
        cy.get('[data-cy="chanePaymentMethod"]').click();
        return this;
    };
    clickOnChangePlan() {
        cy.get('[data-cy="changePlan"]').click();
        return this;
    };
    deletPlan() {
        cy.get('[data-cy="deletPlan"]').click();
        return this;
    };
};
export default new PlaceOrder();
