class HomePage {

    clickOnDoIQualifyBtn() {
        cy.get('[data-cy="do-i-qualify"]').click({force:true});
        return this;
    };
    clickOnDoIQualifySectionBtn() {
        cy.get('[data-cy="do-i-qualify-section-btn"]').click({force:true});
        return this;
    };
    swipeBanner() {
        cy.get('.swiper-button-prev').click({force:true});
        return this;
    };
    clickOnBuyPlan() {
        cy.contains('button[title="Buy Plan"]').click();
        return this;
    };
    clickOnGetItToday(){
        cy.get('[data-cy="get-it-tdy"]').click();
        return this;
    };
    clickOnGetStarted() {
        cy.get('.get-started-button > .button').click();
        return this;
    };
    clickOnGoToPlansButton() {
        cy.contains('Go to plans').click();
        return this;
    };
    clickOnIconClose() {
        cy.get('.modal-close').click();
        return this;
    };
    clickOnTermsAndCondition() {
        cy.contains('a', 'Read the Terms and conditions').click();
        return this;
    };
    clickOnGmLogo() {
        cy.get('a > .logo').click();
        return this;
    };
    clickOnViewAllPlans() {
        cy.get('[data-cy="viewAllPlans"]').click();
        return this;
    };
    clickOnBackToSupport() {
        cy.get('[data-cy=backToSupport]').click();
        return this;
    };
    clickOnContinueActivation() {
        cy.get('[data-cy=continue-to-activation-button]').click();
        return this;
    };
    clickOnTryAgainButton() {
        cy.contains('button[title="Try again"]').click();
        return this;
    };
    clickOnTryAgain() {
        cy.contains('a', 'Try again?').click();
        return this;
    };
    clickOnShopPlansButton() {
        cy.contains('button[title="Shop plans"]').click();
        return this;
    };
    clickOnExistingCustomerTab() {
        cy.get('[data-cy=existing-customer-tab]').click();
        return this;
    };
    clickOnGoToCheckOut() {
        cy.get('#action-button').click();
        return this;
    };
    clickOnContinue() {
        cy.get('[data-cy="okActionButton"]').click();
        return this;
    };
    clickOnContactUs() {
        cy.contains('a', 'Contact us').click();
        return this;
    };
    clickOnGoToPlans() {
        cy.get('[data-cy=action-button]').click();
        return this;
    };
    clickOnCheckCoverage() {
        cy.contains('button[title="Check your coverage"]').click();
        return this;
    };
    clickOnCheckCompatibilityBtn() {
        cy.get('[data-cy="Bring-phone"]').click();
        return this;
    };
    clickOnAllPlansButton() {
        cy.get('#view-all-plans-button').click();
        return this;
    };
    clickOnSavingButton() {
        cy.get('button[title="Start saving today"]').click();
        return this;
    };
    clickOnCheckCoverageButton() {
        cy.get('[data-cy="Check-Coverage"]').click();
        return this;
    };
    clickOnCheckYourCoverageBtn() {
        cy.get('[data-cy="checkYourCoverage"]').click();
        return this;
    };
    clickOnCartIcon() {
        cy.get('[alt="cart icon"]').click({force:true});
        return this;
    };
    clickOnBellIcon() {
        cy.get('.bell_icon').click();
        return this;
    };
    clickOnReferAfriend() {
        cy.get('[data-cy=refer-friend-header]').click();
        return this;
    };
    clickOnActivate() {
        cy.get('[data-cy="activateDesktop"]').click();
        return this;
    };
    clickOnCoverage() {
        cy.get('[data-cy=coverage-header]').click();
        return this;
    };
    clickOnBringYourPhone() {
        cy.get('[data-cy="check-your-phone-header"]').click();
        return this;
    };
    clickOnCheckYourPhone() {
        cy.get('[data-cy="check-phone-button"]').click();
        return this;
    };
    clickOnOrderAddOns() {
        cy.get('[data-cy="orderAddOnsPlanDesktop"]').click({ force: true });
        return this;
    };
    clickOnChangePlan() {
        cy.get('[data-cy="changePlanDesktop"]').click({ force: true });
        return this;
    };
    clickOnPurchasePhone() {
        cy.contains('a', 'Purchase phone').click({ force: true });
        return this;
    };
    clickOnPurchaseNewPlan() {
        cy.get('[data-cy="purchaseANewPlan"]').click({ force: true });
        return this;
    };
    clickOnPhones() {
        cy.contains('a', 'phones').click({ force: true });
        return this;
    };
    clickOnPlans() {
        cy.get('[data-cy="plansLinkDesktop"]').click({ force: true });
        return this;
    };
    clickOnDevices(){
        cy.get('[data-cy="devicesLinkDesktop"]').click({ force: true });
        return this;
    }
    clickOnShopMenu() {
        cy.get('[data-cy="shopMenuDesktop"]').click();
        return this;
    };
    clickOnProfileSetting() {
        cy.get('[data-cy=profile-setting-header]').click({ force: true });
        return this;
    };
    clickOnManageDevice() {
        cy.get('[data-cy="manage-device-header-desktop"]').click({ force: true });
        return this;
    };
    clickOnAccountReferAfriend() {
        cy.get('[data-cy=refer-friend-header]').click({ force: true });
        return this;
    };
    clickOnUsageHistory() {
        cy.get('[data-cy="usage-history-header-desktop"]').click({ force: true });
        return this;
    };
    clickOnPaymentHistory() {
        cy.get('[data-cy="payment-history-header"]').click({ force: true });
        return this;
    };
    clickOnPlanAddOns() {
        cy.get('[data-cy="plan-addOns-header-desktop"]').click({ force: true });
        return this;
    };
    clickOnRefillAccount() {
        cy.get('[data-cy="refill-account-header-desktop"]').click({ force: true });
        return this;
    };
    clickOnPurchasedPlan() {
        cy.get('[data-cy="purchased-plans-header-desktop"]').click({ force: true });
        return this;
    };
    clickOnAccountSummary() {
        cy.get('[data-cy="account-summary-header-desktop"]').click({ force: true });
        return this;
    };
    clickOnMyAccount() {
        cy.get('[data-cy="account-menu-header"]').click({ force: true });
        return this;
    };
    clickOnSignUp() {
        cy.get('[data-cy=signup-link]').click();
        return this;
    };
    clickOnSignIn() {
        cy.get('.login-option > a').click();
        return this;
    };
    clickOnWhyG2G() {
        cy.contains('a', 'why Good2Go').click();
        return this;
    };
    clickOnACPsummary() {
        cy.get('[data-cy="acp-application-header"]').click({ force: true });
        return this;
    };
};
export default new HomePage();