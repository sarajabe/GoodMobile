import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('e2e shipping info validation', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.PROFILE.MOCK_DATA.EMAIL, CONSTANT.PROFILE.MOCK_DATA.NEW_PASSWORD);
    });
    it('Should click on login button', () => {
          PageObjects.AccessControl.logInButton();
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
    it('Should select plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter covered address - ATT', () => {
        PageObjects.Coverage.enterAddressRefATTCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
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
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should click on skip for now link', () => {
        PageObjects.Compatibility.clickOnSkipForNowLink();
    });
    it('Should assert the pop up content', () => {
        cy.get('.twelve').should('have.text',' The service will only work on 4G/5G VoLTE compatible devices. By skipping this step, there is no way to know if your phone is compatible with our networks. Is your phone 4G or 5G and VoLTE compatible? ');
    });
    it('Should click on  yes skip  btn from the pop up ', () => {
        PageObjects.Compatibility.clickOnYesFromThePopUp();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPrepaidPlansPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should click on add new address', () => {
        cy.get('.add-text').should('have.text', 'Add a new address').click();
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the required validation messages', () => {
        cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text', 'Address name is a required field');
        cy.get('[data-cy="addressRequiredMsg"]').should('have.text', 'Address is a Required Field');
        cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
        cy.get('[data-cy="stateIsRequired"]').should('have.text', 'State is a Required Field ');
        cy.get('[data-cy="postalIsRequired"]').should('have.text', 'Postal Code is a Required Field');
    });
    it('Should stay on shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should leave fields empty', () => {
        cy.get('[data-cy="addressName"]').click();
        cy.get('[data-cy="addressName"]').clear();
        cy.get('[data-cy="addressLookup"]').click();
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="suiteNo"]').click();
        cy.get('[data-cy="suiteNo"]').clear();
        cy.get('[data-cy="billingCity"]').click();
        cy.get('[data-cy="billingCity"]').clear();
        cy.get('[data-cy="billingState"]').click();
        cy.get('[data-cy="billingState"]').clear();
        cy.get('[data-cy="billingPostal"]').click();
        cy.get('[data-cy="billingPostal"]').clear();
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the required validation messages', () => {
        cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text', 'Address name is a required field');
        cy.get('[data-cy="addressRequiredMsg"]').should('have.text', 'Address is a Required Field');
        cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
        cy.get('[data-cy="stateIsRequired"]').should('have.text', 'State is a Required Field ');
        cy.get('[data-cy="postalIsRequired"]').should('have.text', 'Postal Code is a Required Field');
    });
    it('Should fill in invalid address data ', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.INVALID_ADDRESS.NAME,
            CONSTANT.SHIPPING.INVALID_ADDRESS.ADDRESS1,
            CONSTANT.SHIPPING.INVALID_ADDRESS.SUITE_NO,
            CONSTANT.SHIPPING.INVALID_ADDRESS.CITY,
            CONSTANT.SHIPPING.INVALID_ADDRESS.STATE,
            CONSTANT.SHIPPING.INVALID_ADDRESS.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should stay on shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should fill in valid state', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.VALID.NAME,
            CONSTANT.SHIPPING.VALID.ADDRESS,
            CONSTANT.SHIPPING.VALID.SUITE_NO,
            CONSTANT.SHIPPING.VALID.CITY,
            CONSTANT.SHIPPING.VALID.STATE,
            CONSTANT.SHIPPING.VALID.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should fill in invalid address data ', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.INVALID_ADDRESS.NAME,
            CONSTANT.SHIPPING.INVALID_ADDRESS.ADDRESS1,
            CONSTANT.SHIPPING.INVALID_ADDRESS.SUITE_NO,
            CONSTANT.SHIPPING.INVALID_ADDRESS.CITY,
            CONSTANT.SHIPPING.INVALID_ADDRESS.STATE,
            CONSTANT.SHIPPING.INVALID_ADDRESS.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should stay on shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should fill in invalid address data ', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.PoBox.NAME,
            CONSTANT.SHIPPING.PoBox.ADDRESS,
            CONSTANT.SHIPPING.PoBox.SUITE_NO,
            CONSTANT.SHIPPING.PoBox.CITY,
            CONSTANT.SHIPPING.PoBox.STATE,
            CONSTANT.SHIPPING.PoBox.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should click on edit address btn from the pop up of unverified address', () => {
        PageObjects.Acp.clickOnAccountSummaryFromPopUp();
    });
    it('Should fill in valid address data but the city begin with space', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.CITY_BEGIN_WITH_SPACE.NAME,
            CONSTANT.SHIPPING.CITY_BEGIN_WITH_SPACE.ADDRESS,
            CONSTANT.SHIPPING.CITY_BEGIN_WITH_SPACE.SUITE_NO,
            CONSTANT.SHIPPING.CITY_BEGIN_WITH_SPACE.CITY,
            CONSTANT.SHIPPING.CITY_BEGIN_WITH_SPACE.STATE,
            CONSTANT.SHIPPING.CITY_BEGIN_WITH_SPACE.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
    });
    it('Should stay on shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should fill in valid address data but the state begin with space', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.STATE_BEGIN_WITH_SPACE.NAME,
            CONSTANT.SHIPPING.STATE_BEGIN_WITH_SPACE.ADDRESS,
            CONSTANT.SHIPPING.STATE_BEGIN_WITH_SPACE.SUITE_NO,
            CONSTANT.SHIPPING.STATE_BEGIN_WITH_SPACE.CITY,
            CONSTANT.SHIPPING.STATE_BEGIN_WITH_SPACE.STATE,
            CONSTANT.SHIPPING.STATE_BEGIN_WITH_SPACE.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
    });
    it('Should stay on shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should fill in valid address data but the state begin with space', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.POSTAL_BEGIN_WITH_SPACE.NAME,
            CONSTANT.SHIPPING.POSTAL_BEGIN_WITH_SPACE.ADDRESS,
            CONSTANT.SHIPPING.POSTAL_BEGIN_WITH_SPACE.SUITE_NO,
            CONSTANT.SHIPPING.POSTAL_BEGIN_WITH_SPACE.CITY,
            CONSTANT.SHIPPING.POSTAL_BEGIN_WITH_SPACE.STATE,
            CONSTANT.SHIPPING.POSTAL_BEGIN_WITH_SPACE.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should stay on shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should fill in valid address data but the state, city, postal begin with space', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.ALLL_BEGIN_WITH_SPACE.NAME,
            CONSTANT.SHIPPING.ALLL_BEGIN_WITH_SPACE.ADDRESS,
            CONSTANT.SHIPPING.ALLL_BEGIN_WITH_SPACE.SUITE_NO,
            CONSTANT.SHIPPING.ALLL_BEGIN_WITH_SPACE.CITY,
            CONSTANT.SHIPPING.ALLL_BEGIN_WITH_SPACE.STATE,
            CONSTANT.SHIPPING.ALLL_BEGIN_WITH_SPACE.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should stay on shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
});