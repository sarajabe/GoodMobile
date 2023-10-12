import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Do not sign in then check compatibility att - android', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should go to bring your phone and check compatibility ATT address - IMEI', () => {
        PageObjects.Compatibility.checkCompatibilityAttAddressAndroidIMEI();
    });
});
