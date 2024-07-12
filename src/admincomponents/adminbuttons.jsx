import React from 'react';

const ButtonSection = ({ togglePopup }) => {
  return (
    <div className="buttonSection">
      <div className="buttonContainer">
        <button type="button" id="manageUserBtn" onClick={() => togglePopup('userPopup')}>Manage User</button>
        <button type="button" id="manageSubCategoryBtn" onClick={() => togglePopup('subCategoryPopup')}>Manage Sub-Categories</button>
        <button type="button" id="manageBitesBtn" onClick={() => togglePopup('bitesPopup')}>Manage Bites</button>
        <button type="button" id="manageMissionsBtn" onClick={() => togglePopup('missionsPopup')}>Manage Missions</button>
        <button type="button" id="managePartnerBtn" onClick={() => togglePopup('partnerPopup')}>Manage Partners</button>
      </div>
    </div>
  );
};

export default ButtonSection;