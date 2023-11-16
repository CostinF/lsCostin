export class amazonItems {

    loadAndSplitCSV() {
        const filePath = 'cypress/utils/amazonItems/items.csv'
        cy.readFile(filePath)
            .then((content) => {
                const array = content.split(',');

                cy.wrap(array)
                    .as('array');
            });
    };

    goToPageAndSearchItem(item) {
        cy.visit('/');
        cy.get('#twotabsearchtextbox').type(item, {delay: 0});
        cy.get('#nav-search-submit-button').click();
    };
}

export const amazon = new amazonItems();

