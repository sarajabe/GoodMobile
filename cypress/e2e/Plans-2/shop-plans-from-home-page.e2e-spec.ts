import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Shop plan from home page and assert the cart content', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
    //1GB
    it('Should select the 1GB plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPrepaidPlansPage();
    });
    it('Add the 1GB to the cart', () => {
        PageObjects.Plans.clickOnAdd1GbToCart();
    });
    it('should click on i already have a phone ', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it('Should enter the address reference', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
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
    it('Should click on yes I am sure', () => {
        PageObjects.Compatibility.clickOnYesIamSureFromThePopUp();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPrepaidPlansPage();
    });
    it('Should assert plan title to have 1GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '1GB 4G LTE ');
    });
    it('Should assert plan quantity', () => {
        cy.get('[data-cy="planQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should select payment method', () => {
        PageObjects.Payment.selectFirstPaymentMethod();
    });
    it('should click on next', () => {
        PageObjects.Payment.clickOnNextBtn();
    });
    it('Should assert plan title to have 1GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '1GB 4G LTE ');
    });
    it('Should assert plan quantity', () => {
        cy.get(':nth-child(1) > .details > .quantity').should('have.text', 'Quantity: 1');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('should delete the plan', () => {
        PageObjects.PlaceOrder.deletePlan();
    });
    it('should click on yes from the pop up', () => {
        PageObjects.PlaceOrder.clickOnYesFromThePopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
    //3GB
    it('Should select the 3GB plan', () => {
        PageObjects.Plans.clickOn3GB_from_plans_page();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPrepaidPlansPage();
    });
    it('Add the 3GB to the cart', () => {
        PageObjects.Plans.clickOnAdd3GbToCart();
    });
    it('should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it('Should enter the address reference', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
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
    it('Should click on yes I am sure', () => {
        PageObjects.Compatibility.clickOnYesIamSureFromThePopUp();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPrepaidPlansPage();
    });
    it('Should assert plan title to have 3GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '3GB 4G LTE');
    });
    it('Should assert plan quantity', () => {
        cy.get('[data-cy="planQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should select payment method', () => {
        PageObjects.Payment.selectFirstPaymentMethod();
    });
    it('should click on next', () => {
        PageObjects.Payment.clickOnNextBtn();
    });
    it('Should assert plan title to have 3GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '3GB 4G LTE');
    });
    it('Should assert plan quantity', () => {
        cy.get(':nth-child(1) > .details > .quantity').should('have.text', 'Quantity: 1');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('should delete the plan', () => {
        PageObjects.PlaceOrder.deletePlan();
    });
    it('should click on yes from the pop up', () => {
        PageObjects.PlaceOrder.clickOnYesFromThePopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
    //6GB
    it('Should select the 6GB plan', () => {
        PageObjects.Plans.clickOn6GB_From_Plans_Page();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPrepaidPlansPage();
    });
    it('Add the 6GB to the cart', () => {
        PageObjects.Plans.clickOnAdd6GbToCart();
    });
    it('should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it('Should enter the address reference', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
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
    it('Should click on yes I am sure', () => {
        PageObjects.Compatibility.clickOnYesIamSureFromThePopUp();
    });
    it('Should go to review cart page to buy a plan', () => {
        PageObjects.TitleExpectations.goToPrepaidPlansPage();
    });
    it('Should assert plan title to have 6GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '6GB 4G LTE');
    });
    it('Should assert plan quantity', () => {
        cy.get('[data-cy="planQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should select payment method', () => {
        PageObjects.Payment.selectFirstPaymentMethod();
    });
    it('should click on next', () => {
        PageObjects.Payment.clickOnNextBtn();
    });
    it('Should assert plan title to have 6GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '6GB 4G LTE');
    });
    it('Should assert plan quantity', () => {
        cy.get(':nth-child(1) > .details > .quantity').should('have.text', 'Quantity: 1');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('should delete the plan', () => {
        PageObjects.PlaceOrder.deletePlan();
    });
    it('should click on yes from the pop up', () => {
        PageObjects.PlaceOrder.clickOnYesFromThePopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
});
