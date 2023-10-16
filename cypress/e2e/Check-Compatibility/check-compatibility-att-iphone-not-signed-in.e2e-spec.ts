import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Do not sign in then check compatibility att - iphone', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should go to bring your phone and check compatibility ATT address - iphone IMEI ATT', () => {
        PageObjects.Compatibility.checkCompatibilityAttAddressIphoneAttIMEI();
    });
    it('Should go to bring your phone and check compatibility ATT address - iphone IMEI', () => {
        PageObjects.Compatibility.checkCompatibilityAttAddressIphoneTmoIMEI();
    });
    it('Should go to bring your phone and check compatibility ATT address - Esim Only Iphone IMEI', () => {
        PageObjects.Compatibility.checkCompatibilityAttAddressIphoneImeiEsim();
    });
});
