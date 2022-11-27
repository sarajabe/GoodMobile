import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Refer a friend flow', () => {
      before(() => {
            PageObjects.BeforeAll.executeBeforeAll();
      });
      after(() => {
            PageObjects.AccessControl.logoutFromAccount();
      });
      it('Direct the test to the defined url', () => {
            cy.visit(CONSTANT.REFER_A_FRIEND.REFERRAL_LINK);
      });
      it('Should go plans page', () => {
            PageObjects.TitleExpectations.goToPlansG2GPage();
      });
      it('Should click on add to cart', () => {
            PageObjects.Plans.clickOnPlan_1_GB();
      });
      it('Should click on i already have a phone', () => {
            PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
      });
      it(`Should go to Check Your Phone's Compatibility page`, () => {
            PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
      });
      it('Should click on skip for now link', () => {
            PageObjects.Plans.clickOnSkipForNow();
      });
      it('Should click on no from skip device popup', () => {
            PageObjects.Plans.clickOnYesSkipDevice();
      });
      it('Should go checkout page', () => {
            PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
      });
      it('Should insert valid info for new customer', () => {
            PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA2.FIRST_NAME,
                  CONSTANT.ACCESS.NEW_SIGNUP_DATA2.LAST_NAME,
                  PageObjects.Dynamics.makeNewEmail(),
                  CONSTANT.ACCESS.NEW_SIGNUP_DATA2.PASSWORD,
                  CONSTANT.ACCESS.NEW_SIGNUP_DATA2.CONFIRMED_PASS);
      });
      it('Should check recaptcha', () => {
            PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
      });
      it('Should click on continue button', () => {
            PageObjects.AccessControl.signUpClick();
      });
      it('Should click on continue button from the pop up', () => {
            PageObjects.ReferAFriend.clickOnContinueBtn();
      });
      it('Should go shipping page', () => {
            PageObjects.TitleExpectations.goToShippingPage();
      });
      it('Should that the code from order details equal to nSpXWjs', () => {
            cy.get('.special-promo > .price').should('have.text', 'nSpXWjs');
      });


});
