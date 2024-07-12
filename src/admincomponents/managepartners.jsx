import React from "react";

/**
 * Manage Partner component
 * 
 * This component is responsible for rendering the popup for managing Partner
 * 
 * Props:
 * - closePopup: Function to handle closing the popup
 * - openAddNewPartner: Function to handle opening the add new Partner form
 */
const searchPartner = () => {/* Search users functionality */};

const ManagePartner = ({ closePopup, openAddNewPartner }) => {
  return (
    <div id="managePartner" className="managePartnerPopup">
    <span id="closeManagePartnerPopupBtn" className="closeButton" onClick={closePopup}>×</span>
    <h2>Manage Partners</h2>
    <div className="searchContainer">
      <input type="text" id="searchBar" placeholder="Search by partner..." />
      <button type="button" id="searchPartnerBtn" className="searchButton" onClick={searchPartner}>Search</button>
    </div>
    <div id="partnerDetails">
      <p>All partners will be listed here with a scroll</p>
    </div>
    <button type="button" id="addNewPartnerBtn" className="formButton" onClick={openAddNewPartner}>Add New Partner</button>
  </div>
  );
};

export default ManagePartner;