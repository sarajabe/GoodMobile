import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('sign in then check compatibility', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should go to bring your phone and check compatibility TMO address - iphone IMEI TMO', () => {
        PageObjects.Compatibility.checkCompatibilityTmoAddressIphoneTmoIMEI();
    });
    it('Should add 2gb plan to cart - empty cart', () => {
        PageObjects.PurchasedPlans.purchase2GBPlanAfterCheckCompatibility();
    });
});
