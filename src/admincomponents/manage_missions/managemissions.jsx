import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'
import MissionForm from './formMissions.jsx';
import SearchMissions from './searchMissions.jsx';

/**
 * ManageMissions Component
 * 
 * This component is responsible for managing missions, including searching for a mission and displaying the mission form.
 * 
 * Props:
 * - closePopup: Function to close the popup.
 * - openManageChains: Function to open the Manage Chains popup.
 * - openManageSponsors: Function to open the Manage Sponsors/Partners popup.
 * - openManageSubcategories: Function to open the Manage Subcategories popup.
 */
const ManageMissions = ({ closePopup, openManageChains, openManageSponsors, openManageSubcategories }) => {
  const [selectedMission, setSelectedMission] = useState(null);
  const [sponsorData, setSponsorData] = useState([]);
  const [chainData, setChainData] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);

  /**
   * Fetches necessary data when the component mounts.
   * 
   * This includes sponsor, chain, and subcategory data.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sponsorsResponse, subcategoriesResponse, chainsResponse] = await Promise.all([
          axios.get('http://16.171.3.129:3000/api/sponsors'),
          axios.get('http://16.171.3.129:3000/api/Subcategories'),
          axios.get('http://16.171.3.129:3000/api/chains'),
        ]);

        setSponsorData(sponsorsResponse.data);
        setSubcategoryData(subcategoriesResponse.data);
        setChainData(chainsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  /**
   * handleMissionSelect
   * 
   * Handles the selection of a mission from the search results.
   * 
   * @param {Object} mission - The selected mission object.
   */
  const handleMissionSelect = useCallback((mission) => {
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
          closeForm={() => setSelectedMission(null)} // Resets to search view
          openManageChains={openManageChains}
          openManageSponsors={openManageSponsors}
          openManageSubcategories={openManageSubcategories}
        />
      )}
    </div>
  );
};

export default ManageMissions;