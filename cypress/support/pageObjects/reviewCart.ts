class ReviewCart {

    clickOnEmptyCart(){
        cy.get('[data-cy="emptyCart"]').click();
    };
    clickOnYesEmptyBtnFromPopUp(){
        cy.get('[data-cy="confirm-btn"]').click();
    };
    clickOnCheckoutBtn() {
        cy.get('[data-cy="checkoutBtn"]').click();
        return this;
   };
   clickOnAutoPayCheckBox() {
    cy.get('[data-cy="autoPayCheckBox"]').click();
    return this;
};
closePopUpIcon() {
    cy.get('[data-cy="closeIcon"]').click();
    return this;
};
clickOnNoBtn() {
    cy.get('[data-cy="cancel-btn"]').click();
    return this;
};
clickOnYesBtn() {
    cy.get('[data-cy="confirm-btn"]').click();
    return this;
};

};
export default new ReviewCart();