import { CONSTANT } from "../../fixtures/constants";

class Compatibility {

    clickOnGetStartedBtn() {
        cy.get('[data-cy="getStartedBtn"]').click();
        return this;
    };
    clickOnCheckYourDevice() {
        cy.get('[data-cy="checkYourDeviceButton"]').click();
        return this;
    };
    clickOnCheckAgain() {
        cy.get('[data-cy="checkAgain"]').click();
        return this;
    };
    clickOnProceedToCheckoutBtn() {
        cy.get('[data-cy="nextStepBtn"]').click();
        return this;
    };
    clickOnSkipForNowLink() {
        cy.get('[data-cy="skipForNowLink"]').click();
        return this;
    };
    clickOnCloseIcon() {
        cy.get('.icon-close').click();
        return this;
    };
    clickOnSendMePhysicalSIM() {
        cy.get('[data-cy="sendMePhysicalSIM"]').click();
        return this;
    };
    clickOnCheckPhoneBtn() {
        cy.get('[data-cy="cancel-btn"]').click();
        return this;
    };
    clickOnYesFromThePopUp() {
        cy.get('[data-cy="confirm-btn"]').click();
        return this;
    };
    clickOnYesIamSureFromThePopUp() {
        cy.get('[data-cy="yesIamSure"]').click();
        return this;
    };
    clickOnCheckDeviceForESim() {
        cy.get('[data-cy="checkDeviceForESim"]').click();
        return this;
    };
    enterIMEInumber(imei) {
        cy.get('[data-cy=equipmentNumber]').click();
        cy.get('[data-cy=equipmentNumber]').type(imei);
        return this;
    };
    assertIMEInumberRequired(){
        cy.get('#required-equipment-msg').should('have.text',' This field is required ');
    };
    assertIMEInumberInvalid(){
        cy.get('[data-cy="invalid-equipmentNumber-msg"]').should('have.text', ' Invalid serial, it should be between 11-18 digits ');
    };
    enterATTddressRef() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('163 Kayenta Road, Golden Valley, AZ 86413');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        cy.get('.mat-option-text').first().click();
        cy.get('[data-cy="equipmentNumber"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    assertIMEInumberAddressReferenceRequired(){
        cy.get(':nth-child(2) > .form-field > .validation-message').should('have.text', ' Device IMEI Number Is Required ');
        cy.get('#required-zip-code-label').should('have.text', 'Address is required');
    }
    assertIMEInumberAddressReferenceInvalid(){
        cy.get(':nth-child(2) > .form-field > .validation-message').should('have.text', ' Device IMEI should be between 11-18 digits ');
        cy.get('#required-address-msg').should('have.text', 'Please select address from the autocomplete list');
    }
    addressRefNotSelectedFromList() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('m');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        cy.get('.mat-option-text').first().click();
        cy.get('[data-cy="equipmentNumber"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    enterAddressRef() {
    cy.get('[data-cy="addressRef"]').click();
    cy.get('[data-cy="addressRef"]').type('2');
    cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
    cy.get('.mat-option-text').first().click();
    cy.get('[data-cy="equipmentNumber"]').click();
    cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    clickOnCheckPhoneButton() {
        cy.get('[data-cy="check-phone-button"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    clickOnContinueButton() {
        cy.get('[data-cy="action-button"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
};
export default new Compatibility();
