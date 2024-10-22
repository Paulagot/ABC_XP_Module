import React, { useState, useCallback, memo } from 'react';
import axios from 'axios';


/**
 * SearchMissions Component
 * 
 * This component renders a search bar and displays search results for missions.
 * 
 * Props:
 * - onSelectMission: Function to handle the selection of a mission from the search results.
 */
const SearchMissions = memo(({ onSelectMission }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
  
    /**
     * searchMissions
     * 
     * Sends a GET request to the backend API to search for missions based on the query.
     * 
     * @param {string} query - The search query entered by the user.
     */
    const searchMissions = useCallback(async (query) => {
      if (!query) return; // Skip empty queries
      try {
        const response = await axios.get(`http://16.171.3.129:3000/api/missions/search?name=${query}`);
        setSearchResults(response.data); // Update search results state with the data received
      } catch (error) {
        console.error('Error searching missions:', error);
      }
    }, []);
  
    /**
     * handleSearch
     * 
     * Handles the input change event for the search bar.
     * 
     * @param {Event} e - The input change event.
     */
    const handleSearch = useCallback((e) => {
      const query = e.target.value;
      setSearchQuery(query);
      searchMissions(query);
    }, [searchMissions]);
  
    /**
     * handleSelectMission
     * 
     * Handles the selection of a mission from the search results.
     * 
     * @param {Object} mission - The selected mission object.
     */
    const handleSelectMission = useCallback((mission) => {
      onSelectMission(mission);
      setSearchQuery(''); // Clear the search query
      setSearchResults([]); // Clear search results
    }, [onSelectMission]);
  
    return (
      <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '10px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch} // Attach search handler
          placeholder="Search by Mission..."
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', maxHeight: '300px', overflowY: 'auto' }}>
          {searchResults.map((mission) => (
            <div
              key={mission.mission_id}
              onClick={() => handleSelectMission(mission)}
              style={{ 
                padding: '10px', 
                borderBottom: '1px solid #ddd', 
                cursor: 'pointer',
                backgroundColor: '#fff',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              {mission.name} - {mission.subtitle}
            </div>
          ))}
        </div>
      </div>
    );
  });
  
  export default SearchMissions;