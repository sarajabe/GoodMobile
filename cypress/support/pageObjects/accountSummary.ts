import { CONSTANT } from '../../fixtures/constants/index';

class AccountSummary {

     quantity(){
          cy.get('.quantity');
          return this;
     };
     clickOnPurchasedPlans() {
          cy.get('.item-pending-activations > .items-link').click();
          return this;
     };
     phonePlanSelection(){
          cy.get('select')
          .eq(0)
          .select('(512) 203-1225', { force: true })
          .invoke('val')
          .should('eq', '1: Object')
          return this;
     };
    clickOnAccountSummaryContainer(){
     const index = Math.floor(Math.random() * 3);
     cy.get('.account-address-details-container').eq(index).click();
     cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
         return this;
    };

     clickOnPurchaseNowFirstElement(){
          cy.contains('a','Purchase now?').first().click({force: true});
          return this;
     };
     clickOnPurchaseNowSecondElement(){
          cy.contains('a','Purchase now?').last().click({force: true});
          return this;
     };
     clockOnAccountAddressContainer(){
          cy.get('.account-address-details-container').click()
          return this;
     };
     clickOnACPApplication() {
          cy.contains('a', 'ACP application').click({force: true});
          return this;
     };
     clickOnManageDeviceAndSim() {
          cy.contains('a', 'Manage device & SIM').click();
          return this;
     };
     clickOnCancelButton() {
          cy.get('.modal-actions > :nth-child(2)').click({force:true});
          return this;
     };
    
     clickOnUpdateCheckbox() {
          cy.get('[data-cy=updateCheckbox]').click();
          return this;
     };
     clickOnTermsCheckbox() {
          cy.get('[data-cy=termsCheckbox]').click();
          return this;
     };
     clickOnDisableButton() {
         cy.get('.modal-actions > .primary').click({force: true});
          return this;
     };
     clickOnWifiCallingSlider() {
          cy.get('[data-cy="wifiSlider"]').click({force:true});
          return this;
     };
     clickOnIconClose() {
          cy.get('.icon-close').click({force:true});
          return this;
     };
     clickOnEditWifiCalling() {
          cy.get('[data-cy=editWifiCallingLink]').click();
          return this;
     };
     clickOnActionButton() {
          cy.get('#action-button').click({force:true});
          return this;
     };
     clickOnActivateButton() {
          cy.get('.modal-actions > .button').click();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
          return this;
     };
     checkActivateButtonToBeDisabled() {
          cy.get('.modal-actions > .button').should('be.disabled');
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
          return this;
     };
     clickOnAutoPayCheckBox() {
          cy.get('.checkbox-responsive').click();
          return this;
     };
     clickOnProfileSetting() {
          cy.get('.item-bottom-radius > .items-link').click();
          return this;
     };
     clickOnRemovePlan() {
          cy.get('.actions-container > a').click();
          return this;
     };
     removePlan2thChild(){
          cy.get('.actions-container > :nth-child(2)').click();
     };
     clickOnGoAccountToSummaryBtn() {
          cy.get('[data-cy="goToSummaryBtn"]').click();
          return this;
     };
     clickOnDataSettings() {
          cy.contains('a', 'Data Settings').click();
          return this;
     };
     clickOnOrderAddOns(){
          cy.contains('a', 'Order add-ons').click({force: true});
          return this;
     };
     clickOnChangePlanNow () {
          cy.get('.modal-actions > :nth-child(2)').click({force: true});
          return this;
     };
     clickOnProceedToCheckout () {
          cy.get(':nth-child(1) > .button').click({force: true});
          return this;
     };
     clickOnChangePlanOnExpiry () {
          cy.contains('Yes, make change on expiry date').click({force: true});
          return this;
     };
     clickOnYesClearCart () {
          cy.get('.modal-actions > .primary').click();
          Cypress.on('uncaught:exception', (err, runnable) => {
               // returning false here prevents Cypress from
               // failing the test
               cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
               return false
           });
          return this;
     };
     clickOnGoToSummaryForChangePlan () {
          cy.get('[data-cy="goToSummaryBtn"]').click();
          return this;
     };
     clickOnPlaceYourOrder () {
          cy.get('[data-cy="place-your-order-button"]').click({force:true});
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL4);
          return this;
     };
     clickOnChangePinNumber () {
          cy.contains('a', 'Change PIN number').click({force: true});
          return this;
     };
     clickOnEyeIcon () {
          cy.get('[data-cy=changePin]').click({force: true});
          return this;
     };
     clickOnCancelPlanNow (){
          cy.contains('button[title="Cancel plan now"]');
          return this;
     };
     clickOnYesCancelPlan () {
          cy.get('.primary').click({force: true})
          return this;
     };
     clickOnYesDisableAutoPay () {
          cy.contains("button","Yes").click();
          return this;
     };
     clickOnYesToAutoPay () {
          cy.get('.primary').click({force: true});
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
          return this;
     };
     clickOnYesToAutoPayAndSave () {
          cy.get('[data-cy="confirm-btn"]').click({force: true});
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
          return this;
     };
     clickOnEditPreferredPaymentMethod () {
          cy.contains('a', 'Edit preferred payment method').click({force: true});
          return this;
     };
     clickOnManageDevices () {
          cy.contains('a', 'Manage devices').click({force: true});
          return this;
     };
     clickOnUsageHistory () {
          cy.contains('a', 'Usage history').click({force: true});
          return this;
     };
     clickOnPaymentHistory () {
          cy.contains('a', 'Payment history').click({force: true});
          return this;
     };
     clickOnAccountSummaryLink () {
          cy.contains('a', 'Account summary').click({force: true});
          return this;
     };
     clickOnChangePlan () {
          cy.contains('a', 'Change plan').click({force: true});
          return this;
     };
     clickOnCancelPlan () {
          cy.contains('a', 'Cancel Plan').click({force: true});
          return this;
     };
     clickOnSaveShippingAddress(){
          cy.get('[data-cy="save"]').click();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
     };
     choseShippingAddress(){
          const index = Math.floor(Math.random() * 3);
          cy.get('.account-address-details-container').eq(index).click({force: true});
              return this;
         };
     clickOnSavePayment () {
          cy.get('.row > .button').click({force: true});
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
          return this;
     };
     clickOnEditShippingAddress () {
          cy.contains('a', 'Edit shipping address').click({force: true});
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
          return this;
     };
     sendCurrentPin = (pin) => {
          cy.get('[data-cy=currentPin]').clear();
          cy.get('[data-cy=currentPin]').type(pin);
          return this;
     };
     submit () {
          cy.get('[data-cy=submitBtn]').click({force: true});
          return this;
     };
     sendNewPin = (newPin) => {
          cy.get('[data-cy=pinCode]').clear();
          cy.get('[data-cy=pinCodeConfirm]').clear();
          cy.get('[data-cy=pinCode]').type(newPin);
          cy.get('[data-cy=pinCodeConfirm]').type(newPin);
          return this;
     };
     saveNewPinNumber () {
          cy.contains('a', 'Save new PIN number').click({force: true});
          return this;
     };
     clickOnChangePlanLink () {
          cy.contains('a', 'Change plan').click({force: true});
          return this;
     };
     clickOnPlanAddOns(){
          cy.contains('a', 'Plan add-ons').click({force: true});
          return this;
     };
};
export default new AccountSummary();
