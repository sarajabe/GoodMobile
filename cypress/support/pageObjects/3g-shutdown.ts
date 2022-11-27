

class Shutdown3G {
    fillInMDN(mdn) {
        cy.get('[data-cy="checkMDN"]').clear({force:true});
        cy.get('[data-cy="checkMDN"').type(mdn);

            return this;
      };
      clickOnGoToMyAccountSummaryNtn() {
        cy.get('.modal-actions > .primary').click({force:true})
            return this;
      };
      clickOnCheckBtn() {
        cy.get('[data-cy="checkMDNbtn"]').click({force:true})
            return this;
      };
      clickOnMyPhoneIsNotWorking() {
        cy.get('.not-working-link').click({force:true})
            return this;
      };
      clickOnGotItBtn() {
        cy.get('[data-cy="action-button"]').click({force:true});
            return this;
      };
      clickOnSeewhatPhoneModalsWillWork() {
        cy.get('[data-cy="confirm-btn"]').click({force:true})
            return this;
      };
      clickOnGoBackto3GShutdownPage() {
        cy.get('[data-cy="cancel-btn"]').click({force:true})
            return this;
      };
      clickOnCloseIcon() {
        cy.get('.icon-close').click({force:true});
            return this;
      };
      clickOnCheckAnotherPhoneModals() {
        cy.get('.secondary').click({force:true});
            return this;
      };

};
export default new Shutdown3G();
