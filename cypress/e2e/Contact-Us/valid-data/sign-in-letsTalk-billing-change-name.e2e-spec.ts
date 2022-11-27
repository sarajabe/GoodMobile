import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'




describe('Sign in & Lets Talk as a Billing :', () => {
     before(() => {
          PageObjects.BeforeAll.executeBeforeAll();
     });
     after(()=>{
          PageObjects.AccessControl.logoutFromAccount();
     });
     it('Should click on sign in', () => {
          PageObjects.HomePage.clickOnSignIn();
     });
     it('Should go to login page', () => {
          PageObjects.TitleExpectations.goToLogInPage();
     });
     it('Should fill login info with valid data', () => {
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.LEVAN_ACCOUNT.EMAIL, CONSTANT.ACCESS.LEVAN_ACCOUNT.PASSWORD);
     });
     it('Should click on login button', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should go to account summary page', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
     it('Should click on Contact Us from footer', () => {
          PageObjects.Footer.clickOnContactUs();
     });
     it('Should go to General Good2Go Mobile | Support | Contact Us page', () => {
          PageObjects.TitleExpectations.goToContactUsPage();
     });
     it('Should insert the message & change name successfully', () => {
          PageObjects.Contact.contactECByChangeName(CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID.NAME, CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID.MESSAGE);
     });
     it('Should check recaptcha', () => {
          PageObjects.Recaptcha.checkRecaptcha();
     });
     it('Should click on "Submit" button successfully', () => {
          PageObjects.Contact.clickOnSubmit();
     });
     it('Should click on "Back To Support" button successfully', () => {
          PageObjects.HomePage.clickOnBackToSupport();
     });
     it('Should go back to contact page', () => {
          PageObjects.TitleExpectations.goToContactUsPage();
     });
});
