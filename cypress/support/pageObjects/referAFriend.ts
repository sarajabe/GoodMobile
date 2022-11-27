class ReferAFriend {

  clickOnMoreFAQS() {
    cy.contains('a', 'More FAQs').click();
    return this;
  };
  clickOnReferAFriendBtnHeader() {
    cy.get(':nth-child(5) > [data-cy="refer-friend-header"]').click();
    return this;
  };
  clickOnHowToStartEarning() {
    cy.get('#how-do-i-start-earning-refer-a-friend-credits').click();
    return this;
  };
  clickOnWhatAreTheTerms() {
    cy.get('#what-are-the-terms-for-the-2x-referral-reward-promotion').click();
    return this;
  };
  clickOnReadMoreLink() {
    cy.contains('a', 'Read the Terms').click();
    return this;
  };
  clickOnContinueBtn() {
    cy.get('#action-button').click();
    return this;
  };
  clickOnSendEmailBtn(){
    cy.get('[data-cy="sendEmailBtn"]').click();
    return this;
  };
  fillInReferredFriendInfo(yourFriendName, emailField) {
    cy.get('[data-cy="yourFriendName"]').clear();
    cy.get('[data-cy="yourFriendName"]').type(yourFriendName);
    cy.get('[data-cy="yourFriendEmail"]').clear();
    cy.get('[data-cy="yourFriendEmail"]').type(emailField);
    return this;
  };
  fillInUserInfo(firstName, lastName) {
    cy.get('[data-cy="firstName"]').clear();
    cy.get('[data-cy="firstName"]').type(firstName);
    cy.get('[data-cy="lastName"]').clear();
    cy.get('[data-cy="lastName"]').type(lastName);
    return this;
  };
  clickOnInviteFriendsBtn1() {
    cy.get('.header-text-part > .invite-friends-button > .button').click();
    return this;
  };
  clickOnInviteFriendsBtn2() {
    cy.get('.actions-section > .invite-friends-button > .button').click();
    return this;
  };
};
export default new ReferAFriend();
