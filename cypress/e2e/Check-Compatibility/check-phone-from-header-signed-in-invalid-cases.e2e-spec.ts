import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Check compatibility from header - signed in - invalid cases', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    // check compatiility - invalid address
    it('fill in valid IMEI and invalid address ref - assert validation message', () => {
        PageObjects.Compatibility.checkCompatibilityInvalidAddressValidImei();
    });
    // check compatibility - invalid imei - valid address ref
    it('fill in invalid IMEI and valid address ref - assert validation message', () => {
        PageObjects.Compatibility.checkCompatibilityValidAddressInvalidImei();
    });
    // check compatibility - invalid imei - invalid address ref
    it('fill in invalid IMEI and invalid address ref - assert validation message', () => {
        PageObjects.Compatibility.checkCompatibilityInvalidAddressInvalidImei();
    });
});