import React, { useState, useEffect } from 'react';

/**
 * AddNewSubCategory component
 * 
 * This component is used to add or edit a SubCategory 
 * It also provides dynamic fields based on the selected criteria type.
 * 
 * Props:
 * - closeForm: Function to handle closing the form
 * - validateSubCategoryForm: Function to validate the form data
 */
const AddNewSubCategory = ({ closePopup, validateSubCategoryForm }) => {
 
  return (
    <div id="addSubCategoryForm">
    <span id="closeNewSubCategoryFormBtn" className="closeButton" onClick={closePopup}>×</span>
    <h2>Add Sub-Category</h2>
    <form onSubmit={validateSubCategoryForm}>
      <label htmlFor="subCategoryName">Sub-Category Name:</label>
      <input type="text" id="subCategoryName" name="subCategoryName" placeholder="Enter Sub-Category Name" required /><br /><br />

      <label htmlFor="description">Description:</label>
      <textarea id="description" name="description" placeholder="Enter description"></textarea><br /><br />

      <input type="submit" value="Save" />
    </form>
  </div>
    
  );
};

export default AddNewSubCategory;