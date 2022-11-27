class DataSetup {

    enterPhoneNumber(num) {
        // cy.get('[data-cy=phoneNumber]').clear();
        // cy.get('[data-cy=phoneNumber]').type(num);
        return this;
    };
    clickOnIphoneButton() {
        // cy.get('[data-cy="ios-button"]').click();
        return this;
    };
    clickOnAndroidButton() {
        // cy.get('[data-cy=android-button]').click();
        return this;
    };
};
export default new DataSetup();
