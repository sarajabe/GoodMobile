class faqsPage {
    clickOnHDVoice() {
        cy.contains('a', 'HD Voice').click();
        return this;
    };
    clickOnWifiCalling() {
        cy.contains('a', 'Wi-Fi Calling').click();
        return this;
    };
    clickOnPhoneSetup() {
        cy.contains('a', 'Phone Set-up').click();
        return this;
    };
    clickOnUsingPhone() {
        cy.contains('a', 'Using Phone').click();
        return this;
    };
    clickOnPayAsYouGo() {
        cy.contains('a', 'Pay As You Go').click();
        return this;
    };
    clickOnFaqLink() {
        cy.contains('a', 'FAQs').click();
        return this;
    };
    clickOnGeneral() {
        cy.contains('a', 'General Questions').click();
        return this;
    };
    clickOnBilling() {
        cy.contains('a', 'Billing').click();
        return this;
    };

    clickOnSupport() {
        cy.contains('a', 'Support').click();
        return this;
    };

    addPhoneNumber(phoneNumber) {
        cy.get('#phoneNumber').clear();
        cy.get('#phoneNumber').type(phoneNumber);
        return this;
    };
    clickOnSearch() {
        cy.contains('button[title="Search"]').click();
        return this;
    };
};
export default new faqsPage();
