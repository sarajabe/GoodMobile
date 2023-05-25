import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants';

class PlanAddOns {

    clickOnPlus() {
        cy.get('[data-cy="plusIcon"]').click({force: true});
        return this;
    };

    clickOnMinus() {
        cy.get('[data-cy="minusIcon"]').click({force: true});
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
        cy.get('.actions > .primary').click({force: true});
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    orderDataAddOns(){
        PageObjects.AccountSummary.clickOnPlanAddOns();
        PageObjects.TitleExpectations.goToPlanAddOnsPage();
        PageObjects.PlanAddOns.clickOnPlus();
        cy.get('.quantityNum').should('have.value', '1');
        cy.get('.total').should('have.text', '$10');
        PageObjects.PlanAddOns.clickOnPlus();
        cy.get('.quantityNum').should('have.value', '2');
        cy.get('.total').should('have.text', '$20');
        PageObjects.PlanAddOns.clickOnPlus();
        cy.get('.quantityNum').should('have.value', '3');
        cy.get('.total').should('have.text', '$30');
        PageObjects.PlanAddOns.clickOnPlus();
        cy.get('.quantityNum').should('have.value', '4');
        cy.get('.total').should('have.text', '$40');
        PageObjects.PlanAddOns.clickOnPlus();
        cy.get('.quantityNum').should('have.value', '5');
        cy.get('.total').should('have.text', '$50');
        PageObjects.PlanAddOns.clickOnMinus();
        cy.get('.quantityNum').should('have.value', '4');
        cy.get('.total').should('have.text', '$40');
        PageObjects.PlanAddOns.clickOnMinus();
        cy.get('.quantityNum').should('have.value', '3');
        cy.get('.total').should('have.text', '$30');
        PageObjects.PlanAddOns.clickOnMinus();
        cy.get('.quantityNum').should('have.value', '2');
        cy.get('.total').should('have.text', '$20');
        PageObjects.PlanAddOns.clickOnMinus();
        cy.get('.quantityNum').should('have.value', '1');
        cy.get('.total').should('have.text', '$10');
        PageObjects.PlanAddOns.clickOnMinus();
        cy.get('.quantityNum').should('have.value', '0');
        PageObjects.PlanAddOns.clickOnPlus();
        cy.get('.quantityNum').should('have.value', '1');
        cy.get('.total').should('have.text', '$10');
        PageObjects.PlanAddOns.clickOnProceedCheckout();
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
        cy.get('[data-cy="addOnsPlan"]').should('have.text','Plan Data Add-On');
        cy.get('[data-cy="dataAddOns"]').should('have.text','(Data Add-On)');
        cy.get('[data-cy="subtotal"]').should('have.text','Item(s) price: $10.00');
        PageObjects.ReviewCart.clickOnCheckoutBtn();
        PageObjects.TitleExpectations.goToPaymentPage();
        cy.get('[data-cy="creditCardPayment"]').click();
        PageObjects.Payment.selectFirstPaymentMethod();
        PageObjects.Payment.clickOnNextBtn();
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
        cy.get('.subtotal').should('have.text', ' Total: $11.52 '); 
        cy.get('[data-cy="addOnsPlan"]').should('have.text','Plan Data Add-On');
        cy.get('[data-cy="dataAddOns"]').should('have.text','(Data Add-On)');
        PageObjects.PlaceOrder.deletePlan();
        PageObjects.PlaceOrder.clickOnYesFromThePopUp();
    };
    orderInternationalCalling(){
        PageObjects.AccountSummary.clickOnPlanAddOns();
        PageObjects.TitleExpectations.goToPlanAddOnsPage();
        cy.get('[data-cy="internationalCalling"]').click();
        cy.get('.header-color').should('have.text','Stay in touch with family & friends around the world!');
        PageObjects.PlanAddOns.clickOnProceedCheckout();
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('[data-cy="internationalPayGoPlan"]').should('have.text','Pay Go International');
        cy.get('[data-cy="talkTextAddOns"]').should('have.text','(Talk & text add-on)');
        cy.get('[data-cy="subtotal"]').should('have.text','Item(s) price: $5.00');
        PageObjects.ReviewCart.clickOnCheckoutBtn();
        PageObjects.TitleExpectations.goToPaymentPage();
        cy.get('[data-cy="creditCardPayment"]').click();
        PageObjects.Payment.selectFirstPaymentMethod();
        PageObjects.Payment.clickOnNextBtn();
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
        cy.get('.subtotal').should('have.text', ' Total: $5.75 '); 
        cy.get('[data-cy="internationalPayGoPlan"]').should('have.text','Pay Go International');
        cy.get('[data-cy="talkTextAddOns"]').should('have.text','(Talk & text add-on)');
        PageObjects.PlaceOrder.deletePlan();
        PageObjects.PlaceOrder.clickOnYesFromThePopUp();
    };
};
export default new PlanAddOns();