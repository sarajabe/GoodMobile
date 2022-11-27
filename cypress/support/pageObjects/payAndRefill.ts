import { CONSTANT } from '../../fixtures/constants/index';

class PayAndRefill {

    clickOnPayWithVoucher() {
        cy.get('.fet').click();
        return this;
    };
    selectFirstPaymentMethod() {
        cy.get('.account-address-details-container > .custom-checkbox > .checkbox').click();
        return this;
    };
clickOnSavePaymentMethodBtn(){
    cy.get('.row > .button').contains('button','Save').click({force:true});
    cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
    return this;
};
    clickOnPayWithCard() {
        cy.get('.fet2').click();
        return this;
    };
checkThatTheAutoPayIsChecked(){
    //cy.get('[data-cy="checkBox"]').should('be.checked');
    cy.get('[data-layer="Content"]').should('be.checked');
};

DisableTheAutoPay(){
    cy.get('.modal-actions > .primary').click({force:true});
    cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
}

};
export default new PayAndRefill();