import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe('Check the refer a friend page btns validity', () => {
      before(() => {
            PageObjects.BeforeAll.executeBeforeAll();
      });
      after(() => {
            PageObjects.AccessControl.logoutFromAccount();
      });
      it('Should click on sign in', () => {
            PageObjects.HomePage.clickOnSignIn();
      });
      it('Should go to login page', () => {
            PageObjects.TitleExpectations.goToLogInPage();
      });
      it('Should fill login info with valid data', () => {
            PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_KK_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_KK_ACCOUNT.PASSWORD);
      });
      it('Should click on login button', () => {
            PageObjects.AccessControl.logInButton();
      });
      it('Should go to account summary page', () => {
            PageObjects.TitleExpectations.goToAccountSummaryPage();
      });
      it('Should click on refer a friend from the header', () => {
            PageObjects.ReferAFriend.clickOnReferAFriendBtnHeader();
      });
      it('Should go to invite a friend page', () => {
            PageObjects.TitleExpectations.goToInviteAfriendPage();
      });
      it('Should click on invite a friend btn', () => {
            PageObjects.ReferAFriend.clickOnInviteFriendsBtn1();
      });
      it('Should go to refer a friend page', () => {
            PageObjects.TitleExpectations.goToReferAFriendPage();
      });
      it('Should insert valid info for the user', () => {
            PageObjects.ReferAFriend.fillInUserInfo(CONSTANT.REFER_A_FRIEND.FIRSTNAME, CONSTANT.REFER_A_FRIEND.LASTNAME);
      });
      it('Should insert valid info for the referred friend', () => {
            PageObjects.ReferAFriend.fillInReferredFriendInfo(CONSTANT.REFER_A_FRIEND.FRIENDNAME,
                  PageObjects.Dynamics.makeNewEmail());
      });
      it('Check that the send email btn is enabled ', () => {
            cy.get('[data-cy="sendEmailBtn"]').should('not.be.disabled');
      });
      it(' Click on refer a friend from the header', () => {
            PageObjects.ReferAFriend.clickOnReferAFriendBtnHeader();
      });
      it('Go to invite a friend page', () => {
            PageObjects.TitleExpectations.goToInviteAfriendPage();
      });
      it('Check that the invite a friend btn 2 is enabled ', () => {
            cy.get('.actions-section > .invite-friends-button > .button').should('not.be.disabled');
      });
      it(' Click on read more link', () => {
            PageObjects.ReferAFriend.clickOnReadMoreLink();
      });
      it('Go to terms and conditions page', () => {
            PageObjects.TitleExpectations.goToTermsAndConditionsPage();
      });
      it('Should click on refer a friend from the header again', () => {
            PageObjects.ReferAFriend.clickOnReferAFriendBtnHeader();
      });
      it('Should click on What are the terms for the 2x referral Reward promotion?', () => {
            PageObjects.ReferAFriend.clickOnWhatAreTheTerms();
      });
      it('Should stay in this page', () => {
            PageObjects.TitleExpectations.goToInviteAfriendPage();
      });
      it('Should click on How do I start earning Refer a Friend credits?', () => {
            PageObjects.ReferAFriend.clickOnHowToStartEarning();
      });
      it('Should stay in this page 2', () => {
            PageObjects.TitleExpectations.goToInviteAfriendPage();
      });
      it('Should click on more faqs', () => {
            PageObjects.ReferAFriend.clickOnMoreFAQS();
      });
      it('The url should include refer-friends-and-earn-rewards', () => {
            cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/refer-friends-and-earn-rewards`);
      });
});