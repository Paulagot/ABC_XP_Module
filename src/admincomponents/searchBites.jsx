import React, { useState } from 'react';
import axios from 'axios';

/**
 * SearchBites Component
 * 
 * This component renders a search input and displays search results for bites.
 * 
 * Props:
 * - onSelectBite: Function to handle selection of a bite
 */
const SearchBites = ({ onSelectBite }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  /**
   * Perform the search based on the query
   */
  const searchBites = async (query) => {
    try {
      const response = await axios.get(`http://16.171.3.129:3000/api/bites/search?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('There was an error searching bites!', error);
    }
  };

  /**
   * Handle input changes and trigger search
   */
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    searchBites(e.target.value);
  };

  /**
   * Handle selection of a bite and clear search results
   */
  const handleSelectBite = (bite) => {
    onSelectBite(bite);
    setSearchQuery(''); // Clear the search query
    setSearchResults([]); // Clear search results
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by Bite..."
      />
      <div>
        {searchResults.map((bite) => (
          <div
            key={bite.bite_id}
            onClick={() => handleSelectBite(bite)}
            style={{ cursor: 'pointer' }}
          >
            {bite.name} - {bite.subtitle}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBites;



