// TypeSelector.js
import React from 'react';
import PropTypes from 'prop-types';
import './header.css'; // Import CSS for styling the dropdown

/**
 * TypeSelector component for selecting the content type (Byte or Mission).
 * @param {function} onTypeChange - Function to call when the type is changed.
 * @param {string} selectedType - The currently selected type ("byte" or "mission").
 */
function TypeSelector({ onTypeChange, selectedType }) {
  // Handler for when the dropdown value changes
  const handleChange = (event) => {
    const newType = event.target.value;
    onTypeChange(newType);
  };

  return (
    <div className="type-selector-container">
      <label htmlFor="typeSelector" className="type-selector-label">
        Select Content Type:
      </label>
      <select
        id="typeSelector"
        className="type-selector-dropdown"
        value={selectedType}
        onChange={handleChange}
        title="Choose either Byte or Mission to proceed with content management"
      >
        <option value="" disabled>Select Type</option>
        <option value="byte">Byte</option>
        <option value="mission">Mission</option>
      </select>
    </div>
  );
}

// PropTypes to enforce expected prop types
TypeSelector.propTypes = {
  onTypeChange: PropTypes.func.isRequired,
  selectedType: PropTypes.string.isRequired,
};

export default TypeSelector;
