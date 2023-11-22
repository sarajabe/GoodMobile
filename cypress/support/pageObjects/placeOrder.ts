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
    assert2GBHomeDelivery(){
        cy.get('[data-cy="basePlan"]').should('have.text', '2GB 4G LTE Plan');
        cy.get('[data-cy="deliveryMethod"]').should('have.text', 'Home Delivery ');
    };
    assert6GBHomeDelivery(){
        cy.get('[data-cy="basePlan"]').should('have.text', '6GB 4G LTE Plan');
        cy.get('[data-cy="deliveryMethod"]').should('have.text', 'Home Delivery ');
    };
    assert15GBHomeDelivery(){
        cy.get('[data-cy="basePlan"]').should('have.text', '15GB 4G LTE Plan');
        cy.get('[data-cy="deliveryMethod"]').should('have.text', 'Home Delivery ');
    };
};
export default new PlaceOrder();
