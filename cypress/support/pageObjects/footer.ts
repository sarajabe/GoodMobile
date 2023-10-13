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
    clickOnAcpDevices() {
        cy.get('[data-cy="acpDevicesFooter"]').click();
        return this;
    };
    clickOnHowItWorks() {
        cy.get('[data-cy=howItWorks]').click();
        return this;
    };
    clickOnWhyGM() {
        cy.get('[data-cy="why-gm"]').click();
        return this;
    };
    clickOnAboutGM() {
        cy.get('[data-cy="about-gm"]').click();
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
        cy.get('[data-cy="accountSummaryFooter"]').click();
        return this;
    };
    clickOnCellPhones() {
        cy.get('[data-cy="cellPhones"]').click();
        return this;
    };
    clickOnCellPhonePlans() {
        cy.get('[data-cy="cellPhonePlansFooter"]').click();
        return this;
    };
    clickOnACPApplication(){
        cy.get('[data-cy="acp"]').click();
        return this;
    };
    clickOnWiFiCalling(){
        cy.get('[data-cy="wifiCalling"]').click({force:true});
        return this;
    };
    clickOnHdVoice(){
        cy.get('[data-cy="hdVoice"]').click({force:true});
        return this;
    }
};
export default new Footer();