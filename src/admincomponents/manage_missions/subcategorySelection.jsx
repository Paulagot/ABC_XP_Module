import React from 'react';

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
        <option value="null">None</option> {/* Add None option */}
      </select>
    </div>
  );
};

export default SubcategorySelection;
