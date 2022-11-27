import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'




describe('Lets Talk as a Sales Support :', () => {
     before(() => {
          PageObjects.BeforeAll.executeBeforeAll();
     });
     it('Should click on contact us from home page', () => {
          PageObjects.HomePage.clickOnContactUs();
     });
     it('Should choose Sales Support option successfully', () => {
          PageObjects.Contact.clickOnSalesSupportOption();
     });
     it('Should insert all the information successfully', () => {
          PageObjects.Contact.contactNC(CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID.NAME,
               CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID.EMAIL,
               CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID.PHONE_NUMBER,
               CONSTANT.CONTACT_US.LETS_TALK_DATA.VALID.MESSAGE);
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
