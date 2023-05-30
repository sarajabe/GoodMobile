class PurchaseSuccessful {

    clickOnPurchasedPlansBtn(){
        cy.get('[data-cy="purchasedPlansBtn"]').click();
    };
    assertPurchasedPlenSuccesful(){
        cy.get('[data-cy="homeDeliverySuccessfulNewSIM"]').should('have.text','Lookout for your new SIM Card in the mail!');
        cy.get('[data-cy="activateNewSIM"]').should('have.text',' Once your SIM card arrives in a couple of days, we will help you get your SIM card activated with a brand new phone number, or transfer your active number (port in) from another provider. You can view your plan details and activate it through your Purchased Plans page. ');
    };
};
export default new PurchaseSuccessful();