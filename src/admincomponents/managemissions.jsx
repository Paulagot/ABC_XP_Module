import React from "react";

/**
 * ManageMissions component
 * 
 * This component is responsible for rendering the popup for managing missions
 * 
 * Props:
 * - closePopup: Function to handle closing the popup
 * - openAddNewMission: Function to handle opening the add new mission form
 */
const searchMissions = () => {/* Search missions functionality */};

const ManageMissions = ({ closePopup, openAddNewMission }) => {
  return (
    <div id="manageMissions" className="manageMissionsPopup">
      <span id="closeManageMissionsPopupBtn" className="closeButton" onClick={closePopup}>×</span>
      <h2>Manage Missions</h2>
      <div className="searchContainer">
        <input type="text" id="searchBar" placeholder="Search by mission..." />
        <button type="button" id="searchMissionsBtn" className="searchButton" onClick={searchMissions}>Search</button>
      </div>
      <div id="missionsDetails">
        <p>All missions will be listed here with a scroll</p>
      </div>
      <button type="button" id="addNewMissionsBtn" className="formButton" onClick={openAddNewMission}>Add New Mission</button>
    </div>
  );
};

export default ManageMissions;



