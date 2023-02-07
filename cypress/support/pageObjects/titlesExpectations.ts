import { CONSTANT } from "../../fixtures/constants";

class TitleExpectations {
    goToWrongOrMissingItemPage() {
        cy.title().should('eq', 'Wrong or missing items');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToReturnDevicePage() {
        cy.title().should('eq', 'Return Device');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
        return this;
    };
    goToEditOrderAddressPage() {
        cy.title().should('eq', 'Edit Order Address');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToSomethingElsePage() {
        cy.title().should('eq', 'Something Else');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToOrderNotReceivedPage() {
        cy.title().should('eq', 'Order Not Recieved');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToACPApplicationPage() {
        cy.title().should('eq', 'ACP application');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToReportIssueConfirmationPage() {
        cy.title().should('eq', 'Confirmation ');
        return this;
    };
    goToReportAnIssuePage() {
        cy.title().should('eq', 'Report an issue');
        return this;
    };
    goToOrderDetailsPage() {
        cy.title().should('eq', 'Order Details');
        return this;
    };
    goToReceiptDetailsPage() {
        cy.title().should('eq', 'Receipt details');
        return this;
    };
    goToACPPage() {
        cy.title().should('eq', 'ACP | Affordable Connectivity Program | Good Mobile');
        return this;
    };
    goToInviteAfriendPage() {
        cy.title().should('eq', 'Refer a Friend | Good2Go Mobile');
        return this;
    };
    goToReferAFriendPage () {
        cy.title().should('eq', 'Refer a friend');
        return this;
    };
    goToACPValidatePage () {
        cy.title().should('eq', 'ACP | Affordable Connectivity Program | Validate');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToACPEnrollemntPage () {
        cy.title().should('eq', 'Free UNLIMITED cell phone service with Government program | Good2Go Mobile');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToEBBPage () {
        cy.title().should('eq', 'EBB | Emergency Broadband Benefit Program | Good2Go Mobile');
        return this;
    };
    goToWelcomeOnBoardPage () {
        cy.title().should('eq', 'Welcome onboard!');
        return this;
    };
    goToCompatabilityResultPage () {
        cy.title().should('eq', 'Compatability Result');
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
        return this;
    };
    goToCheckoutNewCustomerPage () {
        cy.title().should('eq', 'Checkout- New Customer');
        return this;
    };
    goToInstagramPage () {
        cy.title().should('eq', 'Good2Go Mobile (@good2gomobile) • Instagram photos and videos');
        return this;
    };
    goToTwitterPage () {
        cy.title().should('eq', 'Good2Go Mobile (@Good2GoMobile) / Twitter');
        return this;
    };
    goToCoveragePage () {
        cy.title().should('eq', 'Coverage');
        return this;
    };
    goToLogInPage () {
        cy.title().should('eq', 'Login To Your Good Mobile Account | Good Mobile');
        return this;
    };
    goToACPSignUpPage () {
        cy.title().should('eq', 'ACP signup | Good2Go Mobile');
        return this;
    };
    goToCancelPlanPage () {
        cy.title().should('eq', 'Cancel plan');
        return this;
    };
    goToChangePlanPage () {
        cy.title().should('eq', 'Change Plan');
        return this;
    };
    goToPrepaidPlansPage () {
        cy.title().should('eq', 'Good2Go Mobile test | Prepaid Cell Phone Plans');
        return this;
    };
    goToPlansGMPage(){
        cy.title().should('eq', 'Unlimited Talk & Text 4G LTE Cell Phone Plans | Good Mobile');
        return this;
    };
    goToReviewCartPage () {
        cy.title().should('eq', 'Good Mobile test');
        return this;
    };
    goToServiceCoverageCheckPage(){
        cy.title().should('eq', 'Good2Go Mobile| Cells Phones | Check Coverage');
        return this;

    };
    goToHomePage () {
        cy.title().should('eq', 'FREE Unlimited Cell Phone Plans | Good Mobile');
        return this;
    };
    goToPlansPage () {
        cy.title().should('eq', 'Good2Go Mobile test | Prepaid Cell Phone Plans');
        return this;
    };
    goToPhonesPage () {
        cy.title().should('eq', 'Good2Go Mobile| Cells Phones');
        return this;
    };
    goToBringYourPhonePage () {
        cy.title().should('eq', 'Keep Your Phone | Good2Go Mobile');
        return this;
    };
    goToCheckCompatibilityPage () {
        cy.title().should('eq', 'Check Compatibility');
        return this;
    };
    goToCheckYourPhoneCompatibilityPage () {
        cy.title().should('eq', `Check Your Phone's Compatibility`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    goToGood2GoCoveragePage () {
        cy.title().should('eq', `Good2Go Coverage`);
        return this;
    };
    goToSimCheckPage () {
        cy.title().should('eq', `SIM check`);
        return this;
    };
    goToReferAFriendFromHeaderPage () {
        cy.title().should('eq', `Refer a Friend | Good2Go Mobile`);
        return this;
    };
    goToAccountSummaryPage () {
        cy.title().should('eq', `Account Summary`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToAccountSummaryPageWithNoMDNS () {
        cy.title().should('eq', `Account Summary`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    goToPurchasedPlansPage () {
        cy.title().should('eq', `Purchased Plans`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
        return this;
    };
    goToPayAndRefillPage () {
        cy.title().should('eq', `Account Pay and Renew`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    goToPlanAddOnsPage () {
        cy.title().should('eq', `Plan addOns`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    goToReferAFriendFromAccountSummaryPage () {
        cy.title().should('eq', `Refer a friend`);
        return this;
    };
    goToOrdersPage () {
        cy.title().should('eq', `Orders`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goTo3gShutdownPage () {
        cy.title().should('eq', `Good2Go Mobile | Support | 3G Shutdown`);
        return this;
    };
    goToPaymentHistoryPage () {
        cy.title().should('eq', `Payment History`);
        cy.wait(20000);
        return this;
    };
    goToUsageHistoryPage () {
        cy.title().should('eq', `Usage History`);
        return this;
    };
    goToManageDevicesPage () {
        cy.title().should('eq', `Manage Devices`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    goToProfileSettingsPage () {
        cy.title().should('eq', `Settings`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToWifiCallingPage () {
        cy.title().should('eq', `Good2Go Wi-Fi Calling`);
        return this;
    };
    goToSetupYourPhoneDataPage () {
        cy.title().should('eq', `Data Setup`);
        return this;
    };
    goToDataSetupAndroid () {
        cy.title().should('eq', `Data Setup | Android`);
        return this;
    };
    goToDataSetupIphone (){
        cy.title().should('eq','Data Setup | IPhone');
    };
    goToHDVoicePage () {
        cy.title().should('eq', `Good2Go HD Voice`);
        return this;
    };
    goToFaqsPage () {
        cy.title().should('eq', `Good2Go Mobile | Support | FAQs`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToContactUsPage () {
        cy.title().should('eq', `Good2Go Mobile | Support | Contact Us`);
        return this;
    };
    goToSiteMapPage () {
        cy.title().should('eq', `Good2Go Sitemap`);
        return this;
    };
    goToAboutGood2GoPage () {
        cy.title().should('eq', `Good2GoMobile | About Good2Go`);
        return this;
    };
    goToWhyGood2GoPage () {
        cy.title().should('eq', `Good2Go Mobile | Why Good2Go?`);
        return this;
    };
    goToHowItWorksPage () {
        cy.title().should('eq', `Good2Go| How It Works`);
        return this;
    };
    goToInternationalCallingPage () {
        cy.title().should('eq', `Good2Go| International Calling`);
        return this;
    };
    goToTermsAndConditionsPage () {
        cy.title().should('eq', `Good2Go Mobile | Support | Terms & Conditions`);
        return this;
    };
    goToHearingAidCompatibilityPage () {
        cy.title().should('eq', `Good2Go Mobile | Support | Hearing Aid Compatibility`);
        return this;
    };
    goToShippingPage () {
        cy.title().should('eq', `Shipping`);
        return this;
    };
    goToPaymentPage () {
        cy.title().should('eq', `Payment`);
        return this;
    };
    goToPlaceYourOrderPage () {
        cy.title().should('eq', `Place your order`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
        return this;
    };
    goToPurchaseSuccessfulPage () {
        cy.title().should('eq', `Purchase Successful`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        return this;
    };
    goToPhoneModelPage () {
        cy.title().should('eq', `Phone Model`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
        return this;
    };
    goToPhoneDetailsPage () {
        cy.title().should('eq', `Phone Details`);
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
        return this;
    };
    goToSelectLinePage () {
        cy.title().should('eq', `Good2Go Mobile| Cells Phones | Select Line`);
        return this;
    };
    goToActivatePortYouSimPage () {
        cy.title().should('eq', `Activate | Port your SIM`);
        return this;
    };
    goToSignUpPage () {
        cy.title().should('eq', `Sign Up | Good Mobile`);
        return this;
    };
};
export default new TitleExpectations();