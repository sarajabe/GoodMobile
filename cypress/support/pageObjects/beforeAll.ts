class BeforeAll {
    
    executeBeforeAll() {
        cy.visit('http://localhost:4000/home');
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