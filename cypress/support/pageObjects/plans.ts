class Plans {

    clickOn3GB_from_plans_page() {
        cy.get('#select-GOOD2GO-MSP-3GB-20').click();
        return this;
    };
    clickOn_4GB_from_compatibility_result_page() {
        cy.get('#select-GOOD2GO-WHISTLE-4GB-30').click();
        return this;
    };
    clickOnAdd6GbToCart() {
        cy.get('#add-to-cart-GOOD2GO-MDG-6GB-30').click();
        return this;
    };
    clickOnAdd3GbToCart() {
        cy.get('#add-to-cart-GOOD2GO-MSP-3GB-20').click();
        return this;
    };
    clickOnAdd1GbToCart() {
        cy.get('#add-to-cart-GOOD2GO-1GB-20').click();
        return this;
    };
    clickOnEbbLearnMoreBtn() {
        cy.get('#check-qualification').click();
        return this;
    };
    /* Skip Check Compatibility */
    clickOnNoSkipDevice() {
        cy.contains('button[title="No"]').click();
        return this;
    };
    clickOnYesSkipDevice() {
        cy.get('.modal-actions > .primary').click();
        return this;
    };
    clickOnSkipForNow() {
        cy.contains('p', 'Skip for now').click();
        return this;
    };
    /* Replacement Plans */
    clickOn1GB_From_Plans_Page() {
        cy.get('#select-GOOD2GO-1GB-20').click({force: true});
        return this;
    };
    /* Go to checkout button for plans */
    clickOnUnlimited_plan_checkout() {
        cy.get('#proceed-to-checkout-GOOD2GO-TALK-TEXT-15').click({force: true});
        return this;
    };
    clickOnPlan_20_GB_checkout() {
        cy.get('#proceed-to-checkout-GOOD2GO-20GB-50').click({force: true});
        return this;
    };
    clickOnPlan_10_GB_checkout() {
        cy.get('#proceed-to-checkout-GOOD2GO-10GB-40').click();
        return this;
    };
    clickOnPlan_6_GB_checkout() {
        cy.get('#proceed-to-checkout-GOOD2GO-MDG-6GB-30').click();
        return this;
    };
    clickOnPlan_2_GB_checkout() {
        cy.get('#proceed-to-checkout-GOOD2GO-2GB-25').click();
        return this;
    };
    clickOnPlan_1_GB_checkout() {
        cy.get('#proceed-to-checkout-GOOD2GO-1GB-20').click();
        return this;
    };
    clickOnUnlimited_From_Plans_Page() {
        cy.get('#select-GOOD2GO-TALK-TEXT-15').click();
        return this;
    };
    clickOn20GB_From_Plans_Page() {
        cy.get('#select-GOOD2GO-20GB-50').click();
        return this;
    };
    clickOnPlan_1_GB() {
        cy.get('#select-GOOD2GO-1GB-20').click();
        return this;
    };
    clickOnPlan_2_GB_Plans_Page() {
        cy.get(':nth-child(1) > .actions > .button').click();
        return this;
    };
    clickOnPlan_2_GB_Home_Page() {
        cy.get('#select-GOOMOBILE-2GB-10').click();
        return this;
    };
    clickOn6GB_From_Plans_Page() {
        cy.get('.right-sperator > .actions > .button').click();
        return this;
    };
    clickOn6GB_From_Home_Page() {
        cy.get('#select-GOOMOBILE-6GB-20').click();
        return this;
    };
    clickOn15GB_From_Plans_Page() {
        cy.get(':nth-child(4) > .actions > .button').click();
        return this;
    };
    clickOn10GB_From_Plans_Page() {
        cy.get('#select-GOOD2GO-10GB-40').click();
        return this;
    };
    clickOnCartIcon() {
        cy.get('[data-cy="clickOnCartIcon"]').click();
        return this;
    };
};
export default new Plans();
