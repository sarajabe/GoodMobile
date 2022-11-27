import { PageObjects } from '.';

class RemoveItem {
    removeItemFromCart() {
        PageObjects.HomePage.clickOnCartIcon();
        PageObjects.TitleExpectations.goToShippingPage();
        PageObjects.AccountSummary.clickOnRemovePlan();
        PageObjects.AccountSummary.clickOnYesClearCart();
        PageObjects.TitleExpectations.goToPlansPage();
    };
};
export default new RemoveItem();
