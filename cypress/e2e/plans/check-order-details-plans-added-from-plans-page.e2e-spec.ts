import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe(' check order details - plans added from home page', () => {
     before(() => {
          PageObjects.BeforeAll.executeBeforeAll();
     });
     it('Should go to home page', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on shop menu', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on plans', () => {
          PageObjects.HomePage.clickOnPlans();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
     it('Should select the 1GB plan', () => {
          PageObjects.Plans.clickOn1GB_From_Plans_Page();
     });
     it('should click on i already have a phone', () => {
          PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
     });
     it('Should go to Check Compatibility page', () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link ', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup ', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page ', () => {
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
     it('Should go to home page to purchase 2GB plan', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on shop menu', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on plans', () => {
          PageObjects.HomePage.clickOnPlans();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
     it('Should select 2GB plan', () => {
          PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
     });
     it('should click on i already have a phone ', () => {
          PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
     });
     it('Should go to Check Compatibility page ', () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link ', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page ', () => {
          PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
     });
     it('Check the plan title to be 2GB', () => {
          cy.contains('.title', '2GB 4G LTE');
     });
     it('Check the 3GB plan quantity to be 1', () => {
          cy.contains('.plan-quantity', 'Quantity: 1');
     });
     it('Should click on remove btn to remove the 2gb plan', () => {
          PageObjects.ShippingPage.clickOnRemoveOrder();
     });
     it('Should click on yes btn from the pop up to remove the 2gb plan', () => {
          PageObjects.ShippingPage.clickOnYesBtn();
     });
     it('Should go to home page to purchase 3gb plan', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on shop menu', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on plans', () => {
          PageObjects.HomePage.clickOnPlans();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
     it('Should select the 1GB plan', () => {
          PageObjects.Plans.clickOn3GB_from_plans_page();
     });
     it('should click on i already have a phone', () => {
          PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
     });
     it('Should go to Check Compatibility page', () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link ', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup ', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page ', () => {
          PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
     });
     it('Check the plan title to be 3GB', () => {
          cy.contains('.title', '3GB 4G LTE');
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
     it('Should go to home page to purchase 6GB plan', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on shop menu', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on plans', () => {
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
     it('Should go to Check Compatibility page ', () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link ', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page ', () => {
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
     it('Should go to home page to purchase 10gb plan', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on shop menu', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on plans', () => {
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
     it('Should go to Check Compatibility page', () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page', () => {
          PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
     });
     it('Check the plan title to be 10GB', () => {
          cy.contains('.title', '10GB 4G LTE');
     });
     it('Check the 6GB plan quantity to be 1', () => {
          cy.contains('.plan-quantity', 'Quantity: 1');
     });
     it('Should click on remove btn to remove the 10gb plan', () => {
          PageObjects.ShippingPage.clickOnRemoveOrder();
     });
     it('Should click on yes btn from the pop up to remove the 10gb plan', () => {
          PageObjects.ShippingPage.clickOnYesBtn();
     });
     it('Should go to home page to purchase 20 gb plan', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on shop menu', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on plans', () => {
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
     it('Should go to Check Compatibility page', () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page ', () => {
          PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
     });
     it('Check the plan title to be 20GB', () => {
          cy.contains('.title', '20GB 4G LTE');
     });
     it('Check the 6GB plan quantity to be 1', () => {
          cy.contains('.plan-quantity', 'Quantity: 1');
     });
     it('Should click on remove btn to remove the 20gb plan', () => {
          PageObjects.ShippingPage.clickOnRemoveOrder();
     });
     it('Should click on yes btn from the pop up to remove the 20gb plan', () => {
          PageObjects.ShippingPage.clickOnYesBtn();
     });
     it('Should go to home page to purchase the 20gb plan', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
     it('Should click on shop menu', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on plans', () => {
          PageObjects.HomePage.clickOnPlans();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
     it('Should select the the unlimited plan', () => {
          PageObjects.Plans.clickOnUnlimited_From_Plans_Page();
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
     it('Check the plan title to be Unlimited Talk & Text', () => {
          cy.contains('.title', 'Unlimited Talk & Text');
     });
     it('Check the 6GB plan quantity to be 1', () => {
          cy.contains('.plan-quantity', 'Quantity: 1');
     });
     it('Should click on remove btn to remove the unlimited plan', () => {
          PageObjects.ShippingPage.clickOnRemoveOrder();
     });
     it('Should click on yes btn from the pop up to remove the unilimited plan', () => {
          PageObjects.ShippingPage.clickOnYesBtn();
     });
     it('Should go to home page2', () => {
          PageObjects.TitleExpectations.goToHomePage();
     });
});
