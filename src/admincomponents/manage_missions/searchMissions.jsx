import React, { useState, useCallback, memo } from 'react';
import axios from 'axios';


const SearchMissions = memo(({ onSelectMission }) => {
    console.log('SearchMissions component rendered'); // Check component rendering

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const searchMissions = useCallback(async (query) => {
        console.log('searchMissions called with query:', query); // Check if function is called
        if (!query) return; // Skip empty queries
        try {
            const response = await axios.get(`http://localhost:3000/api/missions/search?name=${query}`);
            console.log('Query Results:', response.data); // Log response data
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching missions:', error); // Log error details
        }
    }, []);

    const handleSearch = useCallback((e) => {
        console.log('handleSearch called'); // Check if function is triggered
        const query = e.target.value;
        console.log('Search input:', query); // Log query value
        setSearchQuery(query);
        searchMissions(query);
    }, [searchMissions]);

    const handleSelectMission = useCallback((mission) => {
        console.log('Mission selected:', mission); // Log mission selection
        onSelectMission(mission);
        setSearchQuery(''); // Clear the search query
        setSearchResults([]); // Clear search results
    }, [onSelectMission]);

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '10px' }}>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch} // Confirm this function is attached
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
