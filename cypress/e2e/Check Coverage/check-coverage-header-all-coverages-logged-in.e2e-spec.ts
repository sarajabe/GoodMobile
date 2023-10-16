import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Check coverage from header - TMO, ATT and both coverages - logged in', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should leave address field empty and click on check coverage btn - assert validation message', () => {
        PageObjects.Coverage.checkCoverageEmptyField();
    });
    it('Should fill in an address that is not selected from th list - assert validation message', () => {
        PageObjects.Coverage.checkCoverageNotSelectedFromList();
    });
    it('Should check ATT coverage - assert URL', () => {
        PageObjects.Coverage.checkCoverageATT();
    });
    it('Should check TMO coverage - assert URL', () => {
        PageObjects.Coverage.checkCoverageTMO();
    });
    it('Should enter covered address on both ATT & TMO - assert URL', () => {
        PageObjects.Coverage.checkCoverageBothAddressRef();
    });
})

    