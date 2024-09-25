import React from 'react';

/**
 * SubcategorySelection Component
 * 
 * This component is responsible for rendering a dropdown selection for subcategories.
 * 
 * Props:
 * - subcategoryData: Array of subcategory objects to populate the dropdown options.
 * - selectedSubcategory: The currently selected subcategory ID.
 * - handleSubcategoryChange: Function to handle the selection change.
 */

const SubcategorySelection = ({ subcategoryData, selectedSubcategory = '', handleSubcategoryChange }) => {
  return (
    <div id="subcategorySelectionMissions">
      <label htmlFor="includeSubcategory">Subcategory:</label>
      <select
        name="includeSubcategory"
        id="includeSubcategory"
        value={selectedSubcategory}
        onChange={handleSubcategoryChange}
      >
        <option value="" disabled>Select your option</option>
        {subcategoryData.map((subcategory) => (
          <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
            {subcategory.name}
          </option>
        ))}
        {/* Removed the None option */}
      </select>
    </div>
  );
};

export default SubcategorySelection;
