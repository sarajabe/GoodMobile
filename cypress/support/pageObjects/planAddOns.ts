import { CONSTANT } from '../../fixtures/constants/index';

class PlanAddOns {

    clickOnPlus() {
        cy.get('.quantity-section > .primary').click({force: true});
        return this;
    };

    clickOnMinus() {
        cy.contains('button[title=" - "]').click();
        return this;
    };

    clickOnSelectAddOns() {
        cy.contains('button[title="Select add-on"]').click();
        return this;
    };
    clickToSelectAnMdn(){
        cy.get('.menu > #phonePlan').click({force: true});
        cy.contains(' (512) 203-4783 ').click({force: true});
    };
    clickOnProceedCheckout() {
        cy.get('.primary.addon').click({force: true});
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
};
export default new PlanAddOns();