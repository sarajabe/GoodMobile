

import 'cypress-iframe'
class Recaptcha {
  checkRecaptcha() {
    cy.wait(1000);
    cy.get('#captcha-box *> iframe')
      .then($iframe => {
        const $body = $iframe.contents().find('body');
        cy.wrap($body)
          .find('.recaptcha-checkbox-border')
          .should('be.visible')
          .click();
      });
      cy.wait(1000);
    return this;
  };
  checkRecaptcha3GShutdown() {
    cy.wait(1000);
    cy.get('#captcha-box *> iframe').first()
      .then($iframe => {
        const $body = $iframe.contents().find('body');
        cy.wrap($body)
          .find('.recaptcha-checkbox-borderAnimation')
          .should('be.visible')
          .click({force:true});
      });
      cy.wait(1000);
    return this;
  };

  checkRecaptchaCustomerInfo() {
    cy.wait(1000);
    cy.get('[style="width: 304px; height: 78px;"] > div > iframe')
      .then($iframe => {
        const $body = $iframe.contents().find('body');
        cy.wrap($body)
          .find('.recaptcha-checkbox-border')
          .should('be.visible')
          .click();
      });
    return this;
  };
  checkRecaptchaCustomerInfo1() {
    cy.wait(1000);
    cy.get('[style="width: 304px; height: 78px;"] > div > iframe')
      .then($iframe => {
        const $body = $iframe.contents().find('body');
        cy.wrap($body)
          .find('.recaptcha-checkbox')
          .should('be.visible')
          .click();
      });
    return this;
  };

  invisibleRecaptcha() {
    cy.wait(1000);
    cy.get('#reCaptchaContainer *> iframe').click({ force: true });
    return this;
  };

};
export default new Recaptcha();
