import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Do not sign in then check compatibility tmo - iphone', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should go to bring your phone and check compatibility TMO address - iphone IMEI', () => {
        PageObjects.Compatibility.checkCompatibilityTmoAddressIphoneTmoIMEI();
    });
    it('Should go to bring your phone and check compatibility TMO address - iphone IMEI ATT', () => {
        PageObjects.Compatibility.checkCompatibilityTmoAddressIphoneAttIMEI();
    });
    it('Should go to bring your phone and check compatibility TMO address - iphone IMEI esim', () => {
        PageObjects.Compatibility.checkCompatibilityTmoAddressIphoneIMEIEsim();
    });
});
