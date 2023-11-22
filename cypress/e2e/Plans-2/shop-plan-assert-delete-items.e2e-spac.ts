import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Shop plan then assert and delete item', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansGMPage();
    });
    it('Click on 6GB add to cart', () => {
        PageObjects.Plans.clickOn6GB_From_Plans_Page();
    });
    it('Should go check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the address reference', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it(`Should stay in Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should assert that address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should click on skip for now link', () => {
        PageObjects.Compatibility.clickOnSkipForNowLink();
    });
    it('Should click on  yes skip  btn from the pop up ', () => {
        PageObjects.Compatibility.clickOnYesFromThePopUp();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should assert plan title to have 6GB', () => {
        cy.get('[data-cy="basePlan"]').should('have.text', '6GB 4G LTE Plan');
    });
    it('Should assert plan quantity', () => {
        cy.get('[data-cy="planQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert that sim type is SIM Card', () => {
        cy.get('[data-cy="simType-CartItems"]').should('have.text', 'SIM Card');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert that the plan price equals to  $20/mo ', () => {
        cy.get('[data-cy="planPrice"]').should('have.text', ' $20/mo ');
    });
    it('Should assert that the sim price equals to $0', () => {
        cy.get('[data-cy="simPrice"]').should('have.text', '$0');
    });
    it('Should assert that the Subtotal equals to $20.00', () => {
        cy.get('[data-cy="subtotal"]').should('have.text', 'Item(s) price: $20.00');
    });
    it('Should assert that the estimated equals to $20.00', () => {
        cy.get('.estimated').should('have.text', 'Est. Total:  $20.00');
    });
    it('Click on empty cart', () => {
        PageObjects.ReviewCart.clickOnEmptyCart();
    });
    it('Should confirm emptying cart from the pop up', () => {
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
    });
})