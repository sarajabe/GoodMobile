import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Do not sign in then check compatibility tmo - anddroid', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should go to bring your phone and check compatibility TMO address - android IMEI', () => {
        PageObjects.Compatibility.checkCompatibilityTmoAddressAndroidIMEI();
    });
});
