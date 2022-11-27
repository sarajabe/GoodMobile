import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Shop plan from plans page and assert the cart content', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on sign in', () => {
        PageObjects.HomePage.clickOnSignIn();
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
    //1GB
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select the 1GB plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on I already have a phone', () => {
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
    //2GB
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select the 2GB plan', () => {
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
    });
    it('Should click on I already have a phone', () => {
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
    it('Should assert plan title to have 2GB', () => {
       cy.get('[data-cy="basePlan"]').first().should('have.text', '2GB 4G LTE ');
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
    it('Should assert plan title to have 2GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '2GB 4G LTE ');
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
    //3GB
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select the 3GB plan', () => {
        PageObjects.Plans.clickOn3GB_from_plans_page();
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
    //6GB
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select the 6GB plan', () => {
        PageObjects.Plans.clickOn6GB_From_Plans_Page();
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
    //10GB
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select the 10GB plan', () => {
        PageObjects.Plans.clickOn10GB_From_Plans_Page();
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
    it('Should assert plan title to have 10GB', () => {
       cy.get('[data-cy="basePlan"]').first().should('have.text', '10GB 4G LTE ');
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
    it('Should assert plan title to have 10GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '10GB 4G LTE ');
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
    //20GB
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select the 20GB plan', () => {
        PageObjects.Plans.clickOn20GB_From_Plans_Page();
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
    it('Should assert plan title to have 20GB', () => {
       cy.get('[data-cy="basePlan"]').first().should('have.text', '20GB 4G LTE ');
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
    it('Should assert plan title to have 20GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '20GB 4G LTE ');
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
    //Unlimited talk & text
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select the unlimited plan', () => {
        PageObjects.Plans.clickOnUnlimited_From_Plans_Page();
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
    it('Should assert plan title', () => {
       cy.get('[data-cy="basePlan"]').first().should('have.text', 'Unlimited Talk & Text');
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
    it('Should assert plan title to have Unlimited Talk & Text', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', 'Unlimited Talk & Text');
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
});