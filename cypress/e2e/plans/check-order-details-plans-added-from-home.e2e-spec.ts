import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe(' check order details - plans added from home page', () => {
     before(() => {
          PageObjects.BeforeAll.executeBeforeAll();
     });
     it('Should go to home page', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should select 1GB plan', () => {
          PageObjects.Plans.clickOnPlan_1_GB();
     });
     it('Should go to plans page to add the 1GB', () => {
          PageObjects.TitleExpectations.goToPrepaidPlansPage();
     });
     it('Add the 1GB to the cart', () => {
          PageObjects.Plans.clickOnAdd1GbToCart();
     });
     it('should click on i already have a phone ', () => {
          PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
     });
     it('Should go to Check Compatibility page ', () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link 1', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page 1', () => {
          PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
     });
     it('Check the plan title to be 1GB', () => {
          cy.contains('.title', '1GB 4G LTE');
     });
     it('Check the 1GB plan quantity to be 1', () => {
          cy.contains('.plan-quantity', 'Quantity: 1');
     });
     it('Should click on remove btn to remove the 1gb plan', () => {
          PageObjects.ShippingPage.clickOnRemoveOrder();
     });
     it('Should click onyes btn from the pop up to remove the 1gb plan', () => {
          PageObjects.ShippingPage.clickOnYesBtn();
     });
     it('Should go to home page1', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should select 3GB plan', () => {
          PageObjects.Plans.clickOn3GB_from_plans_page();
     });
     it('Should go to plans page to add the 3GB', () => {
          PageObjects.TitleExpectations.goToPrepaidPlansPage();
     });
     it('Add the 3GB to the cart', () => {
          PageObjects.Plans.clickOnAdd3GbToCart();
     });
     it('should click on i already have a phone', () => {
          PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
     });
     it('Should go to Check Compatibility page', () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page 2', () => {
          PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
     });
     it('Check the plan title to be 3GB', () => {
          cy.contains('.title', '3GB 4G LTE');
     });
     it('Check the 3GB plan quantity to be 1', () => {
          cy.contains('.plan-quantity', 'Quantity: 1');
     });
     it('Should click on remove btn to remove the 3gb plan', () => {
          PageObjects.ShippingPage.clickOnRemoveOrder();
     });
     it('Should click on yes btn from the pop up to remove the 3gb plan', () => {
          PageObjects.ShippingPage.clickOnYesBtn();
     });
     it('Should go to home page2', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should select 6GB plan', () => {
          PageObjects.Plans.clickOn6GB_From_Plans_Page();
     });
     it('Should go to plans page to add the 6GB', () => {
          PageObjects.TitleExpectations.goToPrepaidPlansPage();
     });
     it('Add the 6GB to the cart', () => {
          PageObjects.Plans.clickOnAdd6GbToCart();
     });
     it('should click on i already have a phone', () => {
          PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
     });
     it('Should go to Check Compatibility page', () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page 3', () => {
          PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
     });
     it('Check the plan title to be 6GB', () => {
          cy.contains('.title', '6GB 4G LTE');
     });
     it('Check the 6GB plan quantity to be 1', () => {
          cy.contains('.plan-quantity', 'Quantity: 1');
     });
     it('Should click on remove btn to remove the 6gb plan', () => {
          PageObjects.ShippingPage.clickOnRemoveOrder();
     });
     it('Should click on yes btn from the pop up to remove the 6gb plan', () => {
          PageObjects.ShippingPage.clickOnYesBtn();
     });
     it('Should go to home page3', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
});
