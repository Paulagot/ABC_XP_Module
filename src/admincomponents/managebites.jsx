import React from "react";

/**
 * Manage Bites component
 * 
 * This component is responsible for rendering the popup for managing Bites
 * 
 * Props:
 * - closePopup: Function to handle closing the popup
 * - openAddNewBite: Function to handle opening the add new bites form
 */
const searchBites = () => {/* Search users functionality */};

const ManageBites = ({ closePopup, openAddNewBite }) => {
  return (
    <div id="manageBites" className="manageBitesPopup">
    <span id="closeManageBitesPopupBtn" className="closeButton" onClick={closePopup}>×</span>
    <h2>Manage Bites</h2>
    <div className="searchContainer">
      <input type="text" id="searchBar" placeholder="Search by Bite..." />
      <button type="button" id="searchBitesBtn" className="searchButton" onClick={searchBites}>Search</button>
    </div>
    <div id="bitesDetails">
      <p>All bites will be listed here with a scroll</p>
    </div>
    <button type="button" id="addNewBitesBtn" className="formButton" onClick={openAddNewBite}>Add New Bite</button>
    </div>
  );
};

export default ManageBites;

