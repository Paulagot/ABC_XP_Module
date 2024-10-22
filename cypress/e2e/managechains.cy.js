describe('ManageChain Component Workflow', () => {
    beforeEach(() => {
        // Step 1: Visit the admin page
        cy.visit('http://16.171.3.129:5173/admin-app');

        // Step 2: Click the "Manage Chains" button to reveal the ManageChain popup
        cy.contains('Manage Chains').click();

        // Step 3: Ensure the ManageChain component is now visible
        cy.get('#manageChain').should('be.visible');
    });

    it('should search for a chain and populate the form fields when a chain is selected', () => {
        // Step 4: Search for a chain
        cy.get('#searchBar').type('Bitcoin');

        // Step 5: Ensure search results are displayed
        cy.get('.searchResults').should('be.visible');

        // Step 6: Click on the Bitcoin chain from the search results
        cy.contains('.searchResultItem', 'Bitcoin').click();

        // Step 7: Verify that form fields are populated with the Litcoin details
        cy.get('#chainName').should('have.value', 'Bitcoin');
        cy.get('#chainImage').should('have.value', 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400'); // Update with actual image URL
    });

    it('should clear the form fields when the CLEAR button is clicked', () => {
        // Step 4: Search for and select a chain
        cy.get('#searchBar').type('Bitcoin');
        cy.contains('.searchResultItem', 'Bitcoin').click();

        // Step 5: Verify that the form is populated with Bitcoin's details
        cy.get('#chainName').should('have.value', 'Bitcoin');
        cy.get('#chainImage').should('have.value', 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400'); // Update with actual image URL

        // Step 6: Click the CLEAR button
        cy.contains('CLEAR').click();

        // Step 7: Verify that the form fields are cleared
        cy.get('#chainName').should('have.value', '');
        cy.get('#chainImage').should('have.value', '');
    });

    it('should fail to submit when the name is missing', () => {
        cy.get('#chainImage').type('https://example.com/image.png');
        cy.get('form').submit();
        cy.contains('Chain name cannot be empty.').should('be.visible');
      });
    
      it('should fail to submit when the image URL is missing', () => {
        cy.get('#chainName').type('TESTING');
        cy.get('#chainImage').clear();
        cy.get('form').submit();
        cy.contains('Please enter a valid image URL.').should('be.visible');
      });
    
      it('should fail to submit with invalid image URL', () => {
        cy.get('#chainName').type('TESTING');
        cy.get('#chainImage').type('not-a-valid-url');
        cy.get('form').submit();
        cy.contains('Please enter a valid image URL.').should('be.visible');
      });
    
      it('should submit successfully with a valid name and image URL', () => {
        cy.get('#chainName').type('TESTING');
        cy.get('#chainImage').type('https://example.com/valid-image.png');
        cy.get('form').submit();
        cy.contains('Chain created successfully').should('be.visible');
      });

  
    it('should update a chain\'s information', () => {
        // Step 4: Search for and select a chain
        cy.get('#searchBar').type('TESTING');
        cy.contains('.searchResultItem', 'TESTING').click();

        // Step 5: Verify that the form is populated with Tons's details
        cy.get('#chainName').should('have.value', 'TESTING');
        cy.get('#chainImage').should('have.value', 'https://example.com/valid-image.png'); // Update with actual image URL

        // Step 6: Update the chain name and image URL
        cy.get('#chainName').clear().type('TESTING1');
        cy.get('#chainImage').clear().type('https://example.com/ton-updated.png');

        // Step 7: Submit the form to update the chain
        cy.get('form').submit();

        // Step 8: Check for a success message indicating that the update was successful
        cy.contains('updated successfully').should('be.visible');

        // Step 9: Verify that the form fields are cleared after submission
        cy.get('#chainName').should('have.value', '');
        cy.get('#chainImage').should('have.value', '');
    });

    it('should delete a chain and show a confirmation message', () => {
        // Step 4: Search for and select a chain
        cy.get('#searchBar').type('TESTING1');
        cy.contains('.searchResultItem', 'TESTING1').click();

        // Step 5: Verify that the form is populated with Litcoin's details
        cy.get('#chainName').should('have.value', 'TESTING1');
        cy.get('#chainImage').should('have.value', 'https://example.com/ton-updated.png'); // Update with actual image URL

        // Step 6: Click the DELETE button
        cy.contains('DELETE').click();

        // Step 7: Confirm deletion in the confirmation popup
        cy.contains('Yes, Delete').click();

        // Step 8: Check for a success message indicating that the chain was deleted
        cy.contains('Chain deleted successfully').should('be.visible');

        // Step 9: Verify that the form fields are cleared after deletion
        cy.get('#chainName').should('have.value', '');
        cy.get('#chainImage').should('have.value', '');
    });

  
});



