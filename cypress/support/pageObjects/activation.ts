class Activation {

    enterActivationCode(code) {
        cy.get('#code').clear();
        cy.get('#code').type(code);
        cy.get('[data-cy=submit-code]').click();
        return this;
    };
    enterActivationCodeCurrentNumber(activationCODE, currentNumber, accountNumber, accountPassword,
        firstName, lastName, billingAddress, suiteNumber, billingCity, billingState, billingPostal, recoveryNumber) {
        cy.get('[data-cy=activationCode]').clear();
        cy.get('[data-cy=activationCode]').type(activationCODE);
        cy.get('[data-cy=currentNumber]').clear();
        cy.get('[data-cy=currentNumber]').type(currentNumber);
        cy.get('[data-cy=accountNumber]').clear();
        cy.get('[data-cy=accountNumber]').type(accountNumber);
        cy.get('[data-cy=accountPassword]').clear();
        cy.get('[data-cy=accountPassword]').type(accountPassword);
        cy.get('[data-cy=firstName]').clear();
        cy.get('[data-cy=firstName]').type(firstName);
        cy.get('[data-cy=lastName]').clear();
        cy.get('[data-cy=lastName]').type(lastName);
        cy.get('[data-cy=addressLookup]').clear();
        cy.get('[data-cy=addressLookup]').type(billingAddress);
        cy.get('[data-cy=address2]').clear();
        cy.get('[data-cy=address2]').type(suiteNumber);
        cy.get('[data-cy=billingCity]').clear();
        cy.get('[data-cy=billingCity]').type(billingCity);
        cy.get('[data-cy=billingState]').clear();
        cy.get('[data-cy=billingState]').type(billingState);
        cy.get('[data-cy=billingPostal]').clear();
        cy.get('[data-cy=billingPostal]').type(billingPostal);
        cy.get('[data-cy=recoveryNumber]').clear();
        cy.get('[data-cy=recoveryNumber]').type(recoveryNumber);
        cy.get('[data-cy=activate-button]').click();
        return this;
    };

    enteractivationInfoForNewNumber(activationCODE, pin, confirmPin) {
        cy.get('[data-cy="activationCode"]').clear();
        cy.get('[data-cy="activationCode"]').type(activationCODE);
        cy.get('[data-cy="pinCode"]').click({force:true});
        cy.get('[data-cy="pinCode"]').clear();
        cy.get('[data-cy="pinCode"]').type(pin);
        cy.get('[data-cy="pinCodeConfirm"]').click({force:true});
        cy.get('[data-cy="pinCodeConfirm"]').clear();
        cy.get('[data-cy="pinCodeConfirm"]').type(confirmPin);
    
        
        return this;
    };

    clickOnActivateWithNewNumberButton() {
        cy.get('[data-cy="activate-with-new-number-button"]').click();
        return this;
};
};
export default new Activation();
