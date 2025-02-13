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
const ManageMissions = ({ closePopup, openManageChains, openManageSponsors, openManageSubcategories, openAddCriteria, openLandingPageEditor  }) => {
  const [selectedMission, setSelectedMission] = useState(null);
  const [sponsorData, setSponsorData] = useState([]);
  const [chainData, setChainData] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /**
   * Fetches necessary data when the component mounts.
   * 
   * This includes sponsor, chain, and subcategory data.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sponsorsResponse, subcategoriesResponse, chainsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/sponsors`),
          axios.get(`${API_BASE_URL}/api/Subcategories`),
          axios.get(`${API_BASE_URL}/api/chains`),
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
          openAddCriteria={openAddCriteria} // Include missing prop
          openLandingPageEditor={openLandingPageEditor} // Include missing prop
        />
      )}
    </div>
  );
};

export default ManageMissions;