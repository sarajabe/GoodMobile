class Contact {

     clickOnTechnicalSupportOption() {
          cy.get('select').select('Technical Support').should('have.value', 'Technical');
          return this;
     };
     clickOnSalesSupportOption() {
          cy.get('select').select('Sales Support').should('have.value', 'Sales');
          return this;
     };
     clickOnOrderSupportOption() {
          cy.get('select').select('Order Support').should('have.value', 'Order');
          return this;
     };
     clickOnNewCustomerOption() {
          cy.get('select').select('New Customer').should('have.value', 'New_Customer');
          return this;
     };
     contactNC(name, email, phoneNumber, message) {
          cy.get('[data-cy=name]').clear();
          cy.get('[data-cy=email]').clear();
          cy.get('[data-cy=phone]').clear();
          cy.get('[data-cy=message]').clear();
          cy.get('[data-cy=name]').type(name);
          cy.get('[data-cy=email]').type(email);
          cy.get('[data-cy=phone]').type(phoneNumber);
          cy.get('[data-cy=message]').type(message);
          return this;
     };
     contactExistingCustomer(message) {
          cy.get('[data-cy=message]').clear();
          cy.get('[data-cy=message]').type(message);
          return this;
     };
     contactECByChangeName(name, message) {
          cy.get('[data-cy=name]').clear();
          cy.get('[data-cy=message]').clear();
          cy.get('[data-cy=name]').type(name);
          cy.get('[data-cy=message]').type(message);
          return this;
     };
     clickOnSubmit() {
          cy.get('[data-cy=submitButton]').click();
          return this;
     };
};
export default new Contact();
