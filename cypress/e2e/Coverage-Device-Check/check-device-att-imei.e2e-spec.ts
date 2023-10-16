import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe('Coverage & Device check - ATT / TMO IMEI', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should purchase plan - check both coverage and ATT Device', () => {
        PageObjects.Coverage.purchasePlanCheckBothCoverageAttDevice();
    });
    it('Should purchase plan - check ATT coverage and ATT Device', () => {
        PageObjects.Coverage.purchasePlanCheckAttCoverageAttDevice();
    });
    it('Should purchase plan - check TMO coverage and ATT Device', () => {
        PageObjects.Coverage.purchasePlanCheckTmoCoverageAttDevice();
    });
    it('Should purchase plan - check both coverage and TMO Device', () => {
        PageObjects.Coverage.purchasePlanCheckBothCoverageTmoDevice();
    });
    it('Should purchase plan - check TMO coverage and TMO Device', () => {
        PageObjects.Coverage.purchasePlanCheckTmoCoverageTmoDevice();
    });
    it('Should purchase plan - check TMO coverage and ATT Device', () => {
        PageObjects.Coverage.purchasePlanCheckAttCoverageTmoDevice();
    });
});