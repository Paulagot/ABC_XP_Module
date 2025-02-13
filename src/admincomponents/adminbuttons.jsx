import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      await axios.get(`${API_BASE_URL}/api/fetch-users-data`);
      addNotification('User data fetched successfully');

      // Step 2: Sync bytes progress
      await axios.get(`${API_BASE_URL}/api/zenler-progress/full-sync`);
      addNotification('Bytes data synced successfully');

      // Step 3: Sync missions progress
      await axios.get(`${API_BASE_URL}/api/mission-progress/update-all`);
      addNotification('Missions data synced successfully');
    } catch (error) {
      addNotification(`Error: ${error.message}`);
      console.error('Error in sync process:', error);
    }
  };

  const generateSitemap = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/generate-sitemap`);
      addNotification(response.data.message || 'Sitemap generated successfully');
    } catch (error) {
      addNotification(`Error generating sitemap: ${error.message}`);
      console.error('Error generating sitemap:', error);
    }
  };

   
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fetch-data`);
      console.log('Fetched data:', response.data);
      alert('Dashboard data fetched successfully'); // Simple feedback
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Check console for details.');
    }
  };

  return (
    <div className="buttonSection">
      <div className="homebtnContainer">
        <button className="homebtn" type="button" onClick={() => togglePopup('subCategoryPopup')}>Manage Sub-Categories</button>
        <button className="homebtn" type="button" onClick={() => togglePopup('bitesPopup')}>Manage Bites</button>
        <button className="homebtn" type="button" onClick={() => togglePopup('missionsPopup')}>Manage Missions</button>
        <button className="homebtn" type="button" onClick={() => togglePopup('partnerPopup')}>Manage Partners</button>
        <button className="homebtn" type="button" onClick={() => togglePopup('chainPopup')}>Manage Chains</button>
        <button className="homebtn" type="button" onClick={() => togglePopup('criteriaPopup')}>Manage Mission Criteria</button>
        <button className="homebtn" type="button" onClick={() => togglePopup('landingPageEditor')}>Manage Landing Pages</button>
        
        {/* New Buttons */}
        <button className="homebtn" type="button" onClick={syncData}>Sync Data</button>
        <button className="homebtn" type="button" onClick={generateSitemap}>Generate Sitemap</button>
        <button className="homebtn" type="button" onClick={fetchData}>Fetch Courses</button>
      </div>

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
