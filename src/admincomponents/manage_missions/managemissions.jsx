import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'
import MissionForm from './formMissions.jsx';
import SearchMissions from './searchMissions.jsx';

const ManageMissions = ({ closePopup }) => {
  const [selectedMission, setSelectedMission] = useState(null); // Initialized to null to avoid errors
  
  const [sponsorData, setSponsorData] = useState([]);
  const [chainData, setChainData] = useState([]);
  const [subcategoryData, setSubcategoriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const [sponsorsResponse, subcategoriesResponse, chainsResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/sponsors'),
          axios.get('http://localhost:3000/api/Subcategories'),
          axios.get('http://localhost:3000/api/chains'),
        ]);

        setSponsorData(sponsorsResponse.data);
        setSubcategoriesData(subcategoriesResponse.data);
        setChainData(chainsResponse.data);

        console.log('Sponsors data:', sponsorsResponse.data);
        console.log('Subcategories data:', subcategoriesResponse.data);
        console.log('Chains data:', chainsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleMissionSelect = useCallback((mission) => {
    console.log('Mission selected:', mission);
    setSelectedMission(mission);
  }, []);

  return (
    <div id="manageMissions" className="manageMissionsPopup">
      <span id="closeManageMissionsPopupBtn" className="closeButton" onClick={closePopup}>×</span>
      <h2>Manage Missions</h2>

      <SearchMissions onSelectMission={handleMissionSelect} />

      {selectedMission && (
        <MissionForm 
          missionData={selectedMission} 
          sponsorData={sponsorData} 
          chainData={chainData}
          subcategoryData={subcategoryData}
          closeForm={closePopup}
        />
      )}
    </div>
  );
};

export default ManageMissions;