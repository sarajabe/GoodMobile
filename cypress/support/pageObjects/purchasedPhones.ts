import { CONSTANT } from "../../fixtures/constants";

class PurchasedPhones {
        removePhoneFromCart() {
                cy.get('.phones-section > .actions-container > :nth-child(2)').click();
                return this;
        };
        acceptLimitations() {
                cy.get(':nth-child(4) > .radio-img').click();
                return this;
        };
        keepCurrentNetwork() {
                cy.get(':nth-child(4) > .radio-img').click();
                return this;
        };
        clickOnChangeThePreferredNetwork() {
                cy.get(':nth-child(3) > .radio-img').click();
                return this;
        };
        clickOnNoIamNotIntrested() {
                cy.get(':nth-child(3) > .radio-img').click();
                return this;
        };
       clickOnIunderstandCheckBox() {
        cy.get('.checkbox > label').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
        };
        fillInZipCode(zip) {
                cy.get('[data-cy="zipCode"]').clear();
                cy.get('[data-cy="zipCode"]').type(zip);
                return this;
        };
        clickOnDoneBtn() {
                cy.get('.right > .primary').click();
                return this;
        };
        clickOncheckCoverageBtn() {
                cy.get('[data-cy="check-coverage-button"]').click();
                return this;
        };
        clickOnShopIphonePhones() {
                cy.get('[data-cy="shopPhones"]').click();
                return this;
        };
        clickOnShopPixelPhones() {
                cy.get(':nth-child(2) > [data-cy="shopPhones"]').click();
                return this;
        };
        clickOnIAlreadyHaveAphone() {
                cy.get('.first > .button').click();
                return this;
        };
        clickOnINeedToBuyAphone() {
                cy.get('.second > .button').click();
                return this;
        };
        clickOnPurchasePhone() {
                cy.contains('button[title="Purchase phone"]').click();
                return this;
        };
        clickOnChangePhone() {

                cy.contains('button[title="Change phone"]').click();
                return this;
        };
        clickOnActivatePlanButton() {
                cy.contains('button[title="Activate plan"]').click();
                return this;
        };
        clickOnShopPhones() {
                cy.get('.button').click();
                return this;
        };
        clickOnSelectPhone() {
                cy.contains(`button[title="Select phone"]`).click();
                return this;
        };
        clickOnSelect3rdPhone() {
                cy.get(':nth-child(5) > .phone > [data-cy="selectPhone"]').click();
                return this;
        };
        clickOnSelect2ndAndroidPhone() {
                cy.get(':nth-child(3) > .phone > .button').click();
                return this;
        };
        clickOnXSGray() {
                cy.get('.color-options > :nth-child(2)').click({force:true});
                return this;
        };
        clickOnSelecPhoneBtn() {
                cy.get('[data-cy="selectPhone"]').click();
                return this;
        };
        clickOnSignInBtn(){
                cy.get('[data-cy="signInBtn"]').click();
                return this;
        };
        clickOnSelectPhoneDetails() {
                cy.contains('button[title="Select phone"]').click();
                return this;
        };
        clickOnAddANewLine() {
                cy.get('[data-cy="addAnewLine"]').click();
                return this;
        };
        clickOnCurrentMobileNumber() {
                cy.get(':nth-child(2) > .wireless-links-container > .radio-img').click();
                return this;
        };
        clickOnNextBtn() {
                cy.get('.right > .button').click();
                return this;
        };

};
export default new PurchasedPhones();
