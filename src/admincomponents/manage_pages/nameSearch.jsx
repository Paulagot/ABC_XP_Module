// NameSearch.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './header.css';

/**
 * NameSearch component for searching and selecting a Byte or Mission.
 * Fetches a list of names from the backend based on the selected type.
 * @param {string} selectedType - The currently selected content type ("byte" or "mission").
 * @param {function} onSelectName - Callback function when a name is selected.
 */
function NameSearch({ selectedType, onSelectName }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    console.log(API_BASE_URL)

  // Fetch options from the backend whenever selectedType changes
  useEffect(() => {
    if (!selectedType) return;

    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/landing-options/${selectedType}`)
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
        setIsLoading(false);
      });
  }, [selectedType]);

  // Handle input change for search
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle selection of an option
  const handleSelectOption = (id) => {
    const selectedOption = options.find((option) => option.id === id);
    if (selectedOption) {
      onSelectName(selectedOption);
      setSearchQuery(selectedOption.name); // Display selected name in the search input
    }
  };

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="name-search-container">
      <label htmlFor="nameSearch" className="name-search-label">
        Search and Select {selectedType === 'byte' ? 'Byte' : 'Mission'}:
      </label>
      <input
        type="text"
        id="nameSearch"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder={`Type to search ${selectedType}...`}
        className="name-search-input"
        disabled={!selectedType}
        title={!selectedType ? 'Please select a content type first' : ''}
      />
      {isLoading && <div className="loading">Loading...</div>}
      {filteredOptions.length > 0 && (
        <ul className="options-list">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              className="option-item"
              onClick={() => handleSelectOption(option.id)}
              title={`Select ${option.name}`}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
      {!isLoading && filteredOptions.length === 0 && searchQuery && (
        <div className="no-results">No results found</div>
      )}
    </div>
  );
}

// PropTypes for type checking
NameSearch.propTypes = {
  selectedType: PropTypes.string.isRequired,
  onSelectName: PropTypes.func.isRequired,
};

export default NameSearch;
