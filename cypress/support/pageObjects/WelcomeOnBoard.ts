import { PageObjects } from '.';

class welcomeOnBoard {
    clickOnShopPlansBtn() {
        cy.get('[data-cy="shop-plans-button"').click();
    };
};
export default new welcomeOnBoard();
