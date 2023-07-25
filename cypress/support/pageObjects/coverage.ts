import { CONSTANT } from "../../fixtures/constants";

class Coverage {

    enterIMEInumber(imei) {
        cy.get('[data-cy=equipmentNumber]').clear();
        cy.get('[data-cy=equipmentNumber]').type(imei);
        return this;
    };
    enterAddressRefNoCoverage() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('Jordan Creek Parkway,West Des Moines,IA undefined');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        cy.get('.mat-option-text').first().click();
        return this;
    };
    enterAddressRefTMO() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('2');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        cy.get('.mat-option-text').first().click();
        return this;
    };
    enterAddressRefATT() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('0 Duval St');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        cy.get('.mat-option-text').first().click();
        return this;
    };
    invalidAddressRef() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('m');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        cy.get('.mat-option-text').first().click();
        return this;
    };
    addressRefNotSelectedFromList() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('mjgf');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    assertAddressIsRequired(){
        cy.get('#required-address-msg').should('have.text','Address is a Required Field');
    }
    assertAddressNotSelectedFromList(){
        cy.get('#required-address-msg').should('have.text','Please select address from the autocomplete list');
    }
    clickOnCheckCoverageBtn() {
        cy.get('[data-cy="check-coverage"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    clickOnNextStepBtn() {
        cy.get('[data-cy="nextStepBtn"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    enterAddressRefBothCoverages() {
        cy.get('[data-cy="addressRef"]').click({force:true});
        cy.get('[data-cy="addressRef"]').clear();
        cy.get('[data-cy="addressRef"]').type('123 William St, New York, NY 10038').then(() => {
            cy.get('.mat-option-text').first().click();
        });
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    enterAddressRefATTCoverages() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('16 Village Ln, Colleyville, TX 76034');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
        cy.get('.mat-option-text').first().click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    enterAddressRefTMOCoverages() {
        cy.get('[data-cy="addressRef"]').click();
        cy.get('[data-cy="addressRef"]').type('325 North Saint Paul Street, Dallas, TX 75201');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
        cy.get('.mat-option-text').first().click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    enterIccidnumber(imei) {
        cy.get('#iccidNumber').clear();
        cy.get('#iccidNumber').type(imei);
        return this;
    };
    clickOnCheckYourPhoneBtn() {
        cy.get('[data-cy="checkYourPhoneBtn"]').click();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
};
export default new Coverage();
