class WifiCallingMenu {

    addAddress1(addressName, addressLookup, SuiteNo) {
        cy.get('[data-cy="addressName"]').clear();
        cy.get('[data-cy="addressName"]').type(addressName);
        cy.get('[data-cy=addressLookup]').clear();
        cy.get('[data-cy=addressLookup]').type(addressLookup);
        cy.get('[data-cy=suiteNo]').clear();
        cy.get('[data-cy=suiteNo]').type(SuiteNo);
        return this;
    };
    addAddress2(City, billingState, billingPostal) {
        cy.get('[data-cy=billingCity]').clear();
        cy.get('[data-cy=billingCity]').type(City);
        cy.get('[data-cy="billingState"]').clear();
        cy.get('[data-cy="billingState"]').type(billingState);
        cy.get('[data-cy=billingPostal]').clear();
        cy.get('[data-cy=billingPostal]').type(billingPostal);
        return this;
    };
    editAddress(addressLookup, SuiteNo) {
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="addressLookup"]').type(addressLookup);
        cy.get('[data-cy=suiteNo]').clear();
        cy.get('[data-cy=suiteNo]').type(SuiteNo);
        return this;
    };
};
export default new WifiCallingMenu();
