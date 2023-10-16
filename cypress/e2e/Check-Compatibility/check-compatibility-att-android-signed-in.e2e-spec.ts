import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('sign in then check compatibility att - android', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should go to bring your phone and check compatibility ATT address - IMEI', () => {
        PageObjects.Compatibility.checkCompatibilityAttAddressAndroidIMEI();
    });
    it('Should add 2gb plan to cart - empty cart', () => {
        PageObjects.PurchasedPlans.purchase2GBPlanAfterCheckCompatibility();
    });
});
