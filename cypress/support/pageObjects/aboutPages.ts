

class aboutPages {
    clickOnInternationalAddOns() {
        cy.get('[data-cy="internationalCalling"]').click();
        return this;
    };
    clickOnG2gFAQs() {
        cy.get('[data-cy="g2gFAQs"]').click();
        return this;
    };
    clickOnViewAllPlans() {
        cy.get('[data-cy="viewAllPlans"]').click();
        return this;
    };
    clickOnBringYourPhone() {
        cy.get('[data-cy="bringYourPhoneHowItWorksPage"]').click();
        return this;
    };
    clickOnShopForPhones() {
        cy.get('[data-cy="shopForPhones"]').click();
        return this;
    };
    
      clickOnGoToPlans() {
        cy.get('[data-cy="goToPlans"]').click();
            return this;
      };

};
export default new aboutPages();
