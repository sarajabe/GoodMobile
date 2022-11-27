class BeforeAll {
    
    executeBeforeAll() {
        cy.visit('http://localhost:4000/home');
        cy.get('.close-icon', { timeout: 2000 }).click();
        //hide referral popup 
        cy.window().then( win => {
            sessionStorage.setItem('hideReferral', 'hide');
        });
        //we should put this here , because in before all if error appears it stop the others
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });

        return this;
        
    };
}
export default new BeforeAll();