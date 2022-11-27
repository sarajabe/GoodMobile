class Footer {
    clickOnACP() {
        cy.get('[data-cy="acp"]').click();
        return this;
    };

    clickOnInstagram() {
        cy.get('.instagram').click();
        return this;
    };
    clickOnTwitter() {
        cy.get('.twitter').click();
        return this;
    };
    clickOnFacebook() {
        cy.get('.fb').click();
        return this;
    };
    clickOnHearingAid() {
        cy.contains('a', 'Hearing aid compatibility').click();
        return this;
    };
    clickOnTermsAndCondition() {
        cy.contains('a', 'Terms & conditions').click();
        return this;
    };
    clickOnIntlCalling() {
        cy.get('[data-cy=intCalling]').click();
        return this;
    };
    clickOnYourOrders() {
        cy.get('[data-cy="yourOrders"] > a').click();

        return this;
    };
    clickOn3GShutdown() {
        cy.get('[data-cy="3gShutdown"] > a').click();
        return this;
    };
    clickOnHowItWorks() {
        cy.get('[data-cy=howItWorks]').click();
        return this;
    };
    clickOnWhyG2G() {
        cy.get('[data-cy=whyG2g]').click();
        return this;
    };
    clickOnAboutG2G() {
        cy.get('[data-cy=aboutG2g]').click();
        return this;
    };
    clickOnSiteMap() {
        cy.get('[data-cy="sitemapLink"] > a').click();

        return this;
    };
    clickOnContactUs() {
        cy.get('[data-cy="contactUs"] > a').click();
        return this;
    };
    clickOnFaqs() {
        cy.get('[data-cy="faqs"] > a').click();
        return this;
    };
    clickOnSetUpYourData() {
        cy.get('[data-cy=setupYourPhoneData]').click();
        return this;
    };
    clickOnProfileSetting() {
        cy.get('[data-cy=profileSettings]').click();
        return this;
    };
    clickOnManageDevice() {
        cy.get('[data-cy="manageDevices"]').click();
        return this;
    };
    clickOnUsage() {
        cy.get('[data-cy="usage"] > a').click();
        return this;
    };
    clickOnPaymentHistory() {
        cy.get('[data-cy="paymentrHistory"]').click();
        return this;
    };
    clickOnPayAndRefill() {
        cy.get('[data-cy="payAndRefill"]').click();
        return this;
    };
    clickOnAccountSummary() {
        cy.get('[data-cy="accountSummary"]').click();
        return this;
    };
    clickOnCellPhones() {
        cy.get('[data-cy="cellPhones"]').click();
        return this;
    };
    clickOnCellPhonePlans() {
        cy.get('[data-cy="cellPhonePlans"]').click();
        return this;
    };
};
export default new Footer();