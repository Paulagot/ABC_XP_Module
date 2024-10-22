/// <reference types="cypress" />

describe('ManageSubCategory Component Workflow', () => {

  beforeEach(() => {
      // Step 1: Visit the admin page
      cy.visit('http://16.171.3.129:5173/admin-app');

      // Step 2: Click the "Manage Sub-Categories" button to reveal the ManageSubCategory popup
      cy.get('#manageSubCategoryBtn').click();

      // Step 3: Ensure the ManageSubCategory component is now visible
      cy.get('#manageSubCategory').should('be.visible');
  });

  it('should search for "DeFi" and populate the form field when selected', () => {
      // Step 4: Search for the "DeFi" sub-category
      cy.get('#searchBar').type('DeFi');

      // Step 5: Ensure search results are displayed
      cy.get('.searchResults').should('be.visible');

      // Step 6: Click on the "DeFi" sub-category from the search results
      cy.contains('.searchResultItem', 'DeFi').click();

      // Step 7: Verify that the form field is populated with "DeFi"
      cy.get('#subCategoryName').should('have.value', 'DeFi');
  });

  it('should clear the form field when the CLEAR button is clicked', () => {
      // Step 4: Search for and select the "DeFi" sub-category
      cy.get('#searchBar').type('DeFi');
      cy.contains('.searchResultItem', 'DeFi').click();

      // Step 5: Verify that the form field is populated with "DeFi"
      cy.get('#subCategoryName').should('have.value', 'DeFi');

      // Step 6: Click the CLEAR button
      cy.contains('CLEAR').click();

      // Step 7: Verify that the form field is cleared
      cy.get('#subCategoryName').should('have.value', '');
  });

  it('should prevent submission of a blank entry', () => {
      // Step 4: Ensure the sub-category name field is empty
      cy.get('#subCategoryName').clear();

      // Step 5: Attempt to submit the form with an empty field
      cy.get('form').submit();

      // Step 6: Verify that an error message is displayed
      cy.contains('Sub-Category name cannot be empty.').should('be.visible');
  });

  it('should prevent submission of a duplicate sub-category', () => {
      // Step 4: Attempt to add a sub-category with the name "DeFi" (assuming it's already in the database)
      cy.get('#subCategoryName').type('DeFi');
      cy.get('form').submit();

      // Step 5: Verify that an error message is displayed indicating the sub-category already exists
      cy.contains('Subcategory name already exists.').should('be.visible');
  });

  it('should allow submission of a new sub-category "Paula"', () => {
      // Step 4: Enter the new sub-category name "Paula"
      cy.get('#subCategoryName').type('Paula');

      // Step 5: Submit the form
      cy.get('form').submit();

      // Step 6: Verify that a success message is displayed
      cy.contains('Subcategory created successfully').should('be.visible');

      // Step 7: Verify that the form field is cleared after submission
      cy.get('#subCategoryName').should('have.value', '');
  });

  it('should delete the "Paula" sub-category', () => {
      // Step 4: Search for and select the "Paula" sub-category
      cy.get('#searchBar').type('Paula');
      cy.contains('.searchResultItem', 'Paula').click();

      // Step 5: Verify that the form field is populated with "Paula"
      cy.get('#subCategoryName').should('have.value', 'Paula');

      // Step 6: Click the DELETE button
      cy.contains('DELETE').click();

      // Step 7: Confirm deletion in the confirmation popup
      cy.contains('Yes, Delete').click();

      // Step 8: Verify that a success message is displayed indicating the sub-category was deleted
      cy.contains('Subcategory deleted successfully').should('be.visible');

      // Step 9: Verify that the form field is cleared after deletion
      cy.get('#subCategoryName').should('have.value', '');
  });

  // Additional tests

  it('should prevent submission if a user navigates away from the page and returns without filling in the form', () => {
      // Step 4: Navigate away to another page or reload the current page
      cy.visit('http://16.171.3.129:5173/some-other-page');
      cy.visit('http://16.171.3.129:5173/admin-app');

      // Step 5: Re-open the ManageSubCategory component
      cy.get('#manageSubCategoryBtn').click();
      cy.get('#manageSubCategory').should('be.visible');

      // Step 6: Attempt to submit the form without entering any data
      cy.get('form').submit();

      // Step 7: Verify that an error message is displayed
      cy.contains('Sub-Category name cannot be empty.').should('be.visible');
  });

  it('should handle server errors gracefully when attempting to add a sub-category', () => {
      // Step 4: Stub the server response to simulate a server error
      cy.intercept('POST', '**/api/subcategories', {
          statusCode: 500,
          body: { error: 'Server error, please try again later.' }
      });

      // Step 5: Enter a new sub-category name and submit
      cy.get('#subCategoryName').type('ServerErrorTest');
      cy.get('form').submit();

      // Step 6: Verify that the appropriate error message is displayed
      cy.contains('Server error, please try again later.').should('be.visible');
  });

});




