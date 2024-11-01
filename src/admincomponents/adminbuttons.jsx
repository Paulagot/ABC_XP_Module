import React, { useState } from 'react';
import axios from 'axios';

const ButtonSection = ({ togglePopup }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, message]);

    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((msg) => msg !== message));
    }, 7000);
  };

  const syncData = async () => {
    try {
      // Step 1: Fetch users data
      await axios.get('http://localhost:3000/api/fetch-users-data');
      addNotification('User data fetched successfully');

      // Step 2: Sync bytes progress
      await axios.get('http://localhost:3000/api/zenler-progress/full-sync');
      addNotification('Bytes data synced successfully');

      // Step 3: Sync missions progress
      await axios.get('http://localhost:3000/api/mission-progress/update-all');
      addNotification('Missions data synced successfully');
    } catch (error) {
      addNotification(`Error: ${error.message}`);
      console.error('Error in sync process:', error);
    }
  };

  return (
    <div className="buttonSection">
      <div className="homebtnContainer">
        <button className="homebtn" type="button" id="manageSubCategoryBtn" onClick={() => togglePopup('subCategoryPopup')}>Manage Sub-Categories</button>
        <button className="homebtn" type="button" id="manageBitesBtn" onClick={() => togglePopup('bitesPopup')}>Manage Bites</button>
        <button className="homebtn" type="button" id="manageMissionsBtn" onClick={() => togglePopup('missionsPopup')}>Manage Missions</button>
        <button className="homebtn" type="button" id="managePartnerBtn" onClick={() => togglePopup('partnerPopup')}>Manage Partners</button>
        <button className="homebtn" type="button" id="manageChainBtn" onClick={() => togglePopup('chainPopup')}>Manage Chains</button>
        <button className="homebtn" type="button" id="manageCriteriaBtn" onClick={() => togglePopup('criteriaPopup')}>Manage Mission Criteria</button>

        {/* New Sync Data Button */}
        <button className="homebtn" type="button" onClick={syncData}>Sync Data</button>
      </div>

      {/* Notification Popups */}
      <div className="notifications">
        {notifications.map((message, index) => (
          <div key={index} className="notification">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonSection;
