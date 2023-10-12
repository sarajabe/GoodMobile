import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe('Coverage & Device check - skip IMEI', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should purchase plan - check ATT coverage and skip device', () => {
        PageObjects.Coverage.purchasePlanCheckAttCoverageSkipDevice();
    });
    it('Should purchase plan - check TMO coverage and skip device', () => {
        PageObjects.Coverage.purchasePlanCheckTmoCoverageSkipDevice();
    });
});