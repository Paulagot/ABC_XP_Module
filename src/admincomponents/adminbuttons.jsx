import React from 'react';

const ButtonSection = ({ togglePopup }) => {
  return (
    <div className="buttonSection">
      <div className="homebtnContainer">
        {/* <button className="homebtn" type="button" id="manageUserBtn" onClick={() => togglePopup('userPopup')}>Manage User</button> */}
        <button className="homebtn"  type="button" id="manageSubCategoryBtn" onClick={() => togglePopup('subCategoryPopup')}>Manage Sub-Categories</button>
        <button className="homebtn"  type="button" id="manageBitesBtn" onClick={() => togglePopup('bitesPopup')}>Manage Bites</button>
        <button className="homebtn"  type="button" id="manageMissionsBtn" onClick={() => togglePopup('missionsPopup')}>Manage Missions</button>
        <button className="homebtn"  type="button" id="managePartnerBtn" onClick={() => togglePopup('partnerPopup')}>Manage Partners</button>
        <button className="homebtn"  type="button" id="manageChainBtn" onClick={() => togglePopup('chainPopup')}>Manage Chains</button>
        <button className="homebtn"  type="button" id="manageCriteriaBtn" onClick={() => togglePopup('criteriaPopup')}>Manage Mission Criteria</button>
      </div>
    </div>
  );
};

export default ButtonSection;