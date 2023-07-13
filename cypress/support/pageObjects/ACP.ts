import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants/index';
class Acp {
     clickOnAccountSummaryFromPopUp() {
          cy.get('[data-cy="action-button"]').click();
     };
     clickOnBackToSummaryBtn() {
          cy.get('[data-cy="backToSummaryBtn"]').click();
          return this;
     };
     clickOnCancelPlanBtn() {
          cy.get('[data-cy="cancelPlanBtn"]').click();
          return this;
     };
     clickOnResumeFillingBtn() {
          cy.get('[data-cy="resumeFillingBtn"]').click();
          return this;
     };
     clickOnCancelBtnFromPopUp() {
          cy.get('[data-cy="cancel-btn"]').click();
          return this;
     };
     clickOnCancelAppBtn() {
          cy.get('[data-cy="cancelAppBtn"]').click();
          return this;
     };
     clickOnLearnBtn() {
          cy.get('[data-cy="check-qualification"]').click();
          return this;
     };
     clickOnSubmitBtn() {
          cy.get('.primary').click();
     };
     clickOnVerifyBtn() {
          cy.get('[data-cy="verifyBtn"]').click();
          return this;
     };
     clickOnLessFaqsBtn() {
          cy.get('.more-or-less-faqs > a').click();
          return this;
     };
     clickOnHowLongTheEbbWillBeAvailable() {
          cy.get('#how-long-will-the-acp-program-be-available').click();
          return this;
     };
     clickOnAreAnyBusinessTypeAccountsEligibleForTheACPDiscount() {
          cy.get('#are-any-business-type-accounts-eligible-for-the-acp-discount').click();
          return this;
     };
     clickOnWhatPlansAreEligible() {
          cy.get('#what-plans-are-eligible-for-the-acp-at-good2go-mobile').click();
          return this;
     };
     clickOnIHaveLifelineService() {
          cy.get('#i-have-lifeline-service-am-i-eligible-for-the-acp-at-good2go-mobile').click();
          return this;
     };
     clickOnMoreFaqs() {
          cy.get('.more-or-less-faqs > a').click();
          return this;
     };
     clickOnHowDoIknowTheenrollmentWasSuccessful() {
          cy.get('#how-will-i-know-my-enrollment-was-successful').click();
          return this;
     };
     clickOnHowDoIknow() {
          cy.get('#how-do-i-know-if-i-qualify-for-the-acp-program').click();
          return this;
     };
     clickOnWhoIsEligibile() {
          cy.get('#who-is-eligible-for-the-acp-program').click();
          return this;
     };
     clickOnWhyOfferingBtn() {
          cy.get('#why-is-good2go-offering-this-program').click();
          return this;
     };
     clickOnCheckEligbilityBtn() {
          cy.contains('a', 'why-is-good2go-offering-this-program').click();
          return this;
     };
     clickOnViewFderalAssistanceProgramBtn() {
          cy.contains('a', 'View federal assistance program').click();
          return this;
     };
     clickOnVisitNationalVirifierBtn() {
          cy.contains('a', 'Visit national Verifier').click();
          return this;
     };
     clickOnLearnMoreBtn() {
          cy.get('[data-cy="check-qualification"]').click();
          return this;
     };
     clickOnGotItBtnFromPopUp() {
          cy.get('[data-cy="action-button"]').click();
          return this;
     };
     clickOnUseSameAddressCheckbox() {
          cy.get('[data-cy=useSameAddress]').click();
          return this;
     };
     fillInPhysicalAddressInfo(adrress1, city) {
          cy.get('[data-cy="addressLookup"]').click({force:true});
          cy.get('[data-cy="addressLookup"]').clear();
          cy.get('[data-cy="addressLookup"]').type(adrress1);
          cy.get('[data-cy="city"]').click({force:true});
          cy.get('[data-cy="city"]').clear();
          cy.get('[data-cy="city"]').type(city);
          return this;
     };
     fillInPhysicalAddressInfo2(state, zip) {
          cy.get('[data-cy="state"]').click({force:true});
          cy.get('[data-cy="state"]').clear();
          cy.get('[data-cy="state"]').type(state);
          cy.get('[data-cy="zipCode"]').click({force:true});
          cy.get('[data-cy="zipCode"]').clear();
          cy.get('[data-cy="zipCode"]').type(zip);
          return this;
     };

     fillInMailingAddress(ADDRESS_LINE1, city) {
          cy.get('[data-cy="mailingAddress1"]').click({force:true});
          cy.get('[data-cy="mailingAddress1"]').clear();
          cy.get('[data-cy="mailingAddress1"]').type(ADDRESS_LINE1);
          cy.get('[data-cy="mail-city"]').click({force:true});
          cy.get('[data-cy="mail-city"]').clear();
          cy.get('[data-cy="mail-city"]').type(city);
          return this;
     };
     fillInMailingAddress2(state, zip) {
          cy.get('[data-cy="mail-state"]').click({force:true});
          cy.get('[data-cy="mail-state"]').clear();
          cy.get('[data-cy="mail-state"]').type(state);
          cy.get('[data-cy="mail-zipCode"]').click({force:true});
          cy.get('[data-cy="mail-zipCode"]').clear();
          cy.get('[data-cy="mail-zipCode"]').type(zip);
          return this;
     };
     clickOnQualifyingProgram(FIRST_QUALIFYING_PROGRAM) {
          // browser.actions().mouseMove(qualifyingProgram).perform();
          cy.get('[data-cy=eligibilityCode]').trigger('mousemove');
          cy.get('[data-cy=eligibilityCode]').type(FIRST_QUALIFYING_PROGRAM);
          return this;
     };
     fillInPersonalInfoPart1(firstName, lastName) {
          cy.get('[data-cy="firstName"]').click({force: true});
          cy.get('[data-cy="firstName"]').clear();
          cy.get('[data-cy="firstName"]').type(firstName);
          cy.get('[data-cy="lastName"]').click({force:true});
          cy.get('[data-cy="lastName"]').clear();
          cy.get('[data-cy="lastName"]').type(lastName);
          return this;
     };
     clickOnNextBtn() {
          cy.contains('Next').click();
          return this;
     };
     checkNoRadioBtn() {
          cy.get('#no').click();
          return this;
     };
     checkYesRadioBtn() {
          cy.get('#yes').click();
          return this;
     };
     checkYesWithoutIDRadioBtn() {
          cy.get('#yes-without-id').click();
          return this;
     };
     fillInACPAppID(acpID) {
          cy.get('[data-cy="applicationId"]').click({force:true});
          cy.get('[data-cy="applicationId"]').clear();
          cy.get('[data-cy="applicationId"]').type(acpID);
          return this;
     };
     fillInState(state) {
          cy.get('[data-cy="state"]').click({force:true});
          cy.get('[data-cy="state"]').clear();
          cy.get('[data-cy="state"]').type(state);
          return this;
     };
     clickOnMonth(month) {
          cy.get('[data-cy="month"]').trigger('mousemove');
          cy.get('[data-cy="month"]').type(month);
          return this;
     };
     fillInPersonalInfoPart2(year) {
          cy.get('[data-cy="year"]').click({force:true});
          cy.get('[data-cy="year"]').clear();
          cy.get('[data-cy="year"]').type(year);
          return this;
     };
     fillInEmail(email) {
          cy.get('[data-cy="email"]').click({force:true});
          cy.get('[data-cy="email"]').clear();
          cy.get('[data-cy="email"]').type(email);
          return this;
     };
     fillInPhoneNumber(phone_no) {
          cy.get('[data-cy="phoneNumber"]').click({force:true});
          cy.get('[data-cy="phoneNumber"]').clear();
          cy.get('[data-cy="phoneNumber"]').type(phone_no);
          return this;
     };
     fillInSSN(ssn_no) {
          cy.get('[data-cy="ssn"]').click({force:true});
          cy.get('[data-cy="ssn"]').clear();
          cy.get('[data-cy="ssn"]').type(ssn_no);
          return this;
     };
     fillITribalID(tribal_id) {
          cy.get('[data-cy="tribalID"]').click({force:true});
          cy.get('[data-cy="tribalID"]').clear();
          cy.get('[data-cy="tribalID"]').type(tribal_id);
          return this;
     };
     clickOnIdType(ssn) {
          // browser.actions().mouseMove(idTypeField).perform();
          cy.get('[data-cy="idType"]').trigger('mousemove');
          cy.get('[data-cy="idType"]').type(ssn);
          return this;
     };
     fillInPersonalInfoPart3(ssn_no, phoneNumber,email) {
          cy.get('[data-cy=ssn]').clear();
          cy.get('[data-cy=ssn]').type(ssn_no);
          cy.get('[data-cy="phoneNumber"]').clear();
          cy.get('[data-cy="phoneNumber"]').type(phoneNumber);
          cy.get('[data-cy=email]').clear();
          cy.get('[data-cy=email]').type(email);
          return this;
     };
     clickOnBackBtn() {
          cy.get('[data-cy="backBtn"]').click();
          return this;
     };
     clickOnSignInLink() {
          cy.get('[data-cy="signInLink"]').click();
          return this;
     };
     cllickOnApplyNowFrom3StepsSection() {
          cy.get('[data-cy="applyNow3StepsSection"]').click();
          return this;
     };
     clickOnStartHere() {
          cy.get('[data-cy="startHere"]').click();
          return this;
     };
     clickOnApplyNowBtn() {
          cy.get('[data-cy="bannerApplyNowBtn"]').click();
          return this;
     };
     clickOnGetStarted() {
          cy.contains('a', 'Get Started ').click();
          return this;
     };
     clickOnSSNRadio() {
          cy.get('[data-cy="ssnRadio"]').click();
          return this;
     };
     clickOnTribalRadio() {
          cy.get('[data-cy="tribalBtn"]').click();
          return this;
     };
     clickOnIQualifyIndividually() {
          cy.get('#indivisual').click();
          return this;
     };
     fillInSchoolName() {
          cy.get('[data-cy="schoolName"]').click({force:true})
          cy.get('[data-cy="schoolName"]').clear();
          cy.get('[data-cy="schoolName"]').type('automated test ')
          return this;
     };
     firstCheck() {
          cy.get('[data-cy="firstCheck"]').click()
          cy.get('[data-cy="firstCheck"]').clear();
          cy.get('[data-cy="firstCheck"]').type('CH')
          return this;
     };
     secondCheck() {
          cy.get('[data-cy="secondCheck"]').click();
          cy.get('[data-cy="secondCheck"]').clear();
          cy.get('[data-cy="secondCheck"]').type('CH');
          return this;
     };
     thirdCheck() {
          cy.get('[data-cy="thirdCheck"]').click();
          cy.get('[data-cy="thirdCheck"]').clear();
          cy.get('[data-cy="thirdCheck"]').type('CH');
          return this;
     };
     forthCheck() {
          cy.get('[data-cy="forthCheck"]').click();
          cy.get('[data-cy="forthCheck"]').clear();
          cy.get('[data-cy="forthCheck"]').type('CH');
          return this;
     };
     firstCheckSignUp() {
          cy.get('[data-cy="firstCheck"]').click()
          cy.get('[data-cy="firstCheck"]').clear();
          cy.get('[data-cy="firstCheck"]').type('MY')
          return this;
     };
     secondCheckSignUp() {
          cy.get('[data-cy="secondCheck"]').click();
          cy.get('[data-cy="secondCheck"]').clear();
          cy.get('[data-cy="secondCheck"]').type('MY');
          return this;
     };
     thirdCheckSignUp() {
          cy.get('[data-cy="thirdCheck"]').click();
          cy.get('[data-cy="thirdCheck"]').clear();
          cy.get('[data-cy="thirdCheck"]').type('MY');
          return this;
     };
     forthCheckSignUp() {
          cy.get('[data-cy="forthCheck"]').click();
          cy.get('[data-cy="forthCheck"]').clear();
          cy.get('[data-cy="forthCheck"]').type('MY');
          return this;
     };
     mismatchedInitials() {
          cy.get('[data-cy="firstCheck"]').click();
          cy.get('[data-cy="firstCheck"]').clear();
          cy.get('[data-cy="firstCheck"]').type('MK');
          cy.get('[data-cy="secondCheck"]').click();
          cy.get('[data-cy="secondCheck"]').clear();
          cy.get('[data-cy="secondCheck"]').type('MK');
          cy.get('[data-cy="thirdCheck"]').click();
          cy.get('[data-cy="thirdCheck"]').clear();
          cy.get('[data-cy="thirdCheck"]').type('MK');
          cy.get('[data-cy="forthCheck"]').click();
          cy.get('[data-cy="forthCheck"]').clear();
          cy.get('[data-cy="forthCheck"]').type('MK');
          return this;
     };
     NotAPPFoundSignature() {
          cy.get('[data-cy="firstCheck"]').click();
          cy.get('[data-cy="firstCheck"]').clear();
          cy.get('[data-cy="firstCheck"]').type('ML');
          cy.get('[data-cy="secondCheck"]').click();
          cy.get('[data-cy="secondCheck"]').clear();
          cy.get('[data-cy="secondCheck"]').type('ML');
          cy.get('[data-cy="thirdCheck"]').click();
          cy.get('[data-cy="thirdCheck"]').clear();
          cy.get('[data-cy="thirdCheck"]').type('ML');
          cy.get('[data-cy="forthCheck"]').click();
          cy.get('[data-cy="forthCheck"]').clear();
          cy.get('[data-cy="forthCheck"]').type('ML');
          return this;
     };
     NotCompleteAPPSignature() {
          cy.get('[data-cy="firstCheck"]').click();
          cy.get('[data-cy="firstCheck"]').clear();
          cy.get('[data-cy="firstCheck"]').type('MY')
          cy.get('[data-cy="secondCheck"]').click();
          cy.get('[data-cy="secondCheck"]').clear();
          cy.get('[data-cy="secondCheck"]').type('MY');
          cy.get('[data-cy="thirdCheck"]').click();
          cy.get('[data-cy="thirdCheck"]').clear();
          cy.get('[data-cy="thirdCheck"]').type('MY');
          cy.get('[data-cy="forthCheck"]').click();
          cy.get('[data-cy="forthCheck"]').clear();
          cy.get('[data-cy="forthCheck"]').type('MY');
          return this;
     };
     completeAPPSignature() {
          cy.get('[data-cy="firstCheck"]').click()
          cy.get('[data-cy="firstCheck"]').clear();
          cy.get('[data-cy="firstCheck"]').type('TS')
          cy.get('[data-cy="secondCheck"]').click();
          cy.get('[data-cy="secondCheck"]').clear();
          cy.get('[data-cy="secondCheck"]').type('TS');
          cy.get('[data-cy="thirdCheck"]').click();
          cy.get('[data-cy="thirdCheck"]').clear();
          cy.get('[data-cy="thirdCheck"]').type('TS');
          cy.get('[data-cy="forthCheck"]').click();
          cy.get('[data-cy="forthCheck"]').clear();
          cy.get('[data-cy="forthCheck"]').type('TS');
          return this;
     };
     duplicateAPPSignature() {
          cy.get('[data-cy="firstCheck"]').click()
          cy.get('[data-cy="firstCheck"]').clear();
          cy.get('[data-cy="firstCheck"]').type('DA')
          cy.get('[data-cy="secondCheck"]').click();
          cy.get('[data-cy="secondCheck"]').clear();
          cy.get('[data-cy="secondCheck"]').type('DA');
          cy.get('[data-cy="thirdCheck"]').click();
          cy.get('[data-cy="thirdCheck"]').clear();
          cy.get('[data-cy="thirdCheck"]').type('DA');
          cy.get('[data-cy="forthCheck"]').click();
          cy.get('[data-cy="forthCheck"]').clear();
          cy.get('[data-cy="forthCheck"]').type('DA');
          return this;
     };
     fillInFullName(fullName) {
          cy.get('[data-cy="name"]').click({force:true})
          cy.get('[data-cy="name"]').clear();
          cy.get('[data-cy="name"]').type(fullName)
          return this;
     };
     notCapitalisedInitials() {
          cy.get('[data-cy="firstCheck"]').click();
          cy.get('[data-cy="firstCheck"]').clear();
          cy.get('[data-cy="firstCheck"]').type('mk');
          cy.get('[data-cy="secondCheck"]').click();
          cy.get('[data-cy="secondCheck"]').clear();
          cy.get('[data-cy="secondCheck"]').type('mk');
          cy.get('[data-cy="thirdCheck"]').click();
          cy.get('[data-cy="thirdCheck"]').clear();
          cy.get('[data-cy="thirdCheck"]').type('mk');
          cy.get('[data-cy="forthCheck"]').click();
          cy.get('[data-cy="forthCheck"]').clear();
          cy.get('[data-cy="forthCheck"]').type('mk');
          return this;
     };
     pendingReviewInitials() {
          cy.get('[data-cy="firstCheck"]').click();
          cy.get('[data-cy="firstCheck"]').clear();
          cy.get('[data-cy="firstCheck"]').type('BG');
          cy.get('[data-cy="secondCheck"]').click();
          cy.get('[data-cy="secondCheck"]').clear();
          cy.get('[data-cy="secondCheck"]').type('BG');
          cy.get('[data-cy="thirdCheck"]').click();
          cy.get('[data-cy="thirdCheck"]').clear();
          cy.get('[data-cy="thirdCheck"]').type('BG');
          cy.get('[data-cy="forthCheck"]').click();
          cy.get('[data-cy="forthCheck"]').clear();
          cy.get('[data-cy="forthCheck"]').type('BG');
          return this;
     };
     purchasePlanWithStorePickup(){
          cy.get('.menu-item.ng-star-inserted > .items-link').click();
          PageObjects.TitleExpectations.goToACPApplicationPage();
          cy.get('.actions > .primary').click();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
          cy.get('.title').should('have.text','ACP Enrollment');
          cy.get('[data-cy="checkBtn"]').click();
          PageObjects.Compatibility.assertIMEInumberAddressReferenceRequired();
          PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
          PageObjects.Compatibility.addressRefNotSelectedFromList();
          PageObjects.Compatibility.assertIMEInumberAddressReferenceInvalid();
          PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.TMO_ONLY.TMO1);
          PageObjects.Compatibility.enterAddressRef();
          cy.get('[data-cy="checkBtn"]').click();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
          cy.get('.head-note').should('have.text','Your Phone is compatible!');
          cy.get('[data-cy="nextBtn"]').click();
          PageObjects.Acp.clickOnBackBtn();
          cy.get('.head-note').should('have.text','Your Phone is compatible!');
          cy.get('[data-cy="nextBtn"]').click();
          PageObjects.ShippingPage.clickOnStorePickup();
          cy.get('[data-cy="barCodeVal"]').click();
          cy.get('[data-cy="nextBtn"]').click();
          cy.get('.top-desc').should('have.text','ACP Application successful!');
          cy.get('.sub-desc').should('have.text','Next Steps - In Store SIM Card Pickup.');
          cy.get('[data-cy="continueBtn"]').click();
          PageObjects.TitleExpectations.goToPurchasedPlansPage();
          cy.get('[data-cy="planTitle"]').should('have.text',' Affordable Connectivity Program Plan');
          cy.get('[data-cy="pickupBarCode"]').should('have.text','In-store Pickup Barcode');
          cy.get('[data-cy="deliveryOption"]').should('have.text','Store Pickup');
     }
     cancelPurchasePlan(){
          cy.get('.menu-item.ng-star-inserted > .items-link').click();
          PageObjects.TitleExpectations.goToACPApplicationPage();
          cy.get('.actions > .primary').click();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
          cy.get('.title').should('have.text','ACP Enrollment');
          PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.TMO_ONLY.TMO1);
          PageObjects.Compatibility.enterAddressRef();
          cy.get('[data-cy="checkBtn"]').click();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
          cy.get('.head-note').should('have.text','Your Phone is compatible!');
          cy.get('[data-cy="nextBtn"]').click();
          cy.get('.address-section-title').should('have.text','How do you want to get your package?');
          cy.get('[data-cy="cancel"]').click();
          PageObjects.TitleExpectations.goToACPPage();
     }
     addNewLineHomeDeliveryActivate(){
          cy.get('[data-cy="addNewLine"]').click();
          cy.get('.main-title').should('have.text','Adding a New Line:');
          cy.get('[data-cy="checkBtn"]').click();
          PageObjects.Compatibility.assertIMEInumberAddressReferenceRequired();
          PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.NEWMEID.INVALID_MEID);
          PageObjects.Compatibility.addressRefNotSelectedFromList();
          PageObjects.Compatibility.assertIMEInumberAddressReferenceInvalid();
          PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_ATT);
          PageObjects.Coverage.enterAddressRefBothCoverages();
          cy.get('[data-cy="checkBtn"]').click();
          cy.get('.head-note').should('have.text','Your Phone is compatible!');
          cy.get('.sub-note').should('have.text','You can use the device you have with our network!');
          cy.get('[data-cy="nextBtn"]').click();
          PageObjects.ShippingPage.clickOnHomeDelivery();
          PageObjects.ShippingPage.clickOnAddNewAddress();
          PageObjects.ShippingPage.clickOnSaveBtn();
          cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text', 'Name is a required field');
          cy.get('[data-cy="addressRequiredMsg"]').should('have.text', 'Address is a Required Field');
          cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
          cy.get('[data-cy="requiredStateMsg"]').should('have.text', 'State is a required field ');
          cy.get('[data-cy="postalIsRequired"]').should('have.text', 'Postal Code is a Required Field');
          PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA.NAME,
               CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS,
               CONSTANT.SHIPPING.SHIPPING_DATA.SUITE_NO,
               CONSTANT.SHIPPING.SHIPPING_DATA.CITY,
               CONSTANT.SHIPPING.SHIPPING_DATA.STATE,
               CONSTANT.SHIPPING.SHIPPING_DATA.POSTAL);
          PageObjects.ShippingPage.clickOnSaveBtn();
          PageObjects.ShippingPage.clickOnNextBtn();
          PageObjects.TitleExpectations.goToPurchaseSuccessfulPage();
          cy.get('[data-cy="homeDeliverySuccessfulNewSIM"]').should('have.text','Lookout for your new SIM Card in the mail!');
          cy.get('[data-cy="purchasedPlansBtn"]').click();
          PageObjects.TitleExpectations.goToPurchasedPlansPage();
          cy.get('[data-cy="planTitle"]').should('have.text',' Affordable Connectivity Program Plan');
          cy.get('[data-cy="deliveryOption"]').should('have.text','Home Delivery');
          cy.get('[data-cy="addressCity"]').should('have.text','1250 WATERS PL  111, BRONX,');
          cy.get('[data-cy="statePostalCode"]').should('have.text','NY, 10461-2720');
          cy.get('.menu-item.ng-star-inserted > .items-link').click();
          PageObjects.TitleExpectations.goToACPApplicationPage();
          cy.get('[data-cy="acpPlanActivationStatusValue"]').should('have.text','Pending Activation');
          cy.get('.actions > .primary').click();
          PageObjects.TitleExpectations.goToActivatePortYourSimPage();
          cy.get('#new').click();
          cy.get('.button').click()
          PageObjects.Activation.enteractivationInfoForNewNumber(CONSTANT.ACTIVATION.ACTIVATION_DATA.ACP_NEW_NUMBER.ACTIVATION_CODE,
               CONSTANT.ACTIVATION.ACTIVATION_DATA.ACP_NEW_NUMBER.ACCOUNT_PIN,
               CONSTANT.ACTIVATION.ACTIVATION_DATA.ACP_NEW_NUMBER.CONFIRM_ACCOUNT_PIN);
          PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
          cy.get('[data-cy="activate-button"]').click();
          cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
          cy.get('.title').should('have.text','Successfully activated!');
          cy.get('[data-cy="mdnValue"]').should('have.text','(646) 662-1975');
          cy.get('.action > .button').should('have.text','Select your Device');
          cy.get('.actions > .button').click();
          PageObjects.TitleExpectations.goToAccountSummaryPage();
          cy.get('.menu-item.ng-star-inserted > .items-link').click();
          PageObjects.TitleExpectations.goToACPApplicationPage();
          cy.get('[data-cy="acpPlanActivationStatusValue"]').should('have.text','Enrolled');
          cy.get('[data-cy="youAreEligibleDescription"]').should('have.text','You are eligible for a $100 discount on a new device from our catalog! Hurry up and get yours today!');
          cy.get('[data-cy="acpStatusValueComplete"]').should('have.text','Complete');
          cy.get('[data-cy="acpStatusValue"]').should('have.text','Complete');
          cy.get('[data-cy="mdnValue"]').should('have.text','Phone Number/MDN: (646) 662-1975');
          cy.get('[data-cy="viewApplicationForm"]').click();
          PageObjects.TitleExpectations.goToAcpApplicationDetailsPage();
          cy.get('[data-cy="fullNameValue"]').should('have.text','MRana Yhaddad');
          cy.get('[data-cy="dateOfBirthValue"]').should('have.text','01/19/1991');
          cy.get('[data-cy="identityVerificationValue"]').should('have.text','6462');
     };
};
export default new Acp();
