import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'
describe('Coverage and device check invalid', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should purchase plan - check both coverage and phone - check incalid cases', () => {
        PageObjects.Coverage.purchasePlanCheckBothCoverageDeviceInvalidCases();
    });
    it('Should purchase plan - check ATT coverage and phone - check incalid cases', () => {
        PageObjects.Coverage.purchasePlanCheckAttCoverageDeviceInvalidCases();
    });
    it('Should purchase plan - check TMO coverage and phone - check incalid cases', () => {
        PageObjects.Coverage.purchasePlanCheckTmoCoverageDeviceInvalidCases();
    });
})