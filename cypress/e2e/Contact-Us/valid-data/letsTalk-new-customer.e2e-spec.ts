import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'



describe('Lets Talk as a New Customer :', () => {
     before(() => {
          PageObjects.BeforeAll.executeBeforeAll();
     });
     it('Should click on contact us from home page', () => {
          PageObjects.HomePage.clickOnContactUs();
     });
    
     it('Should choose New Customer option successfully', () => {
          PageObjects.Contact.clickOnNewCustomerOption();
     });
     it('Should insert all the information successfully', () => {
          PageObjects.Contact.contactNC(CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID3.NAME,
               CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID3.EMAIL,
               CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID3.PHONE_NUMBER,
               CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID3.MESSAGE);
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
