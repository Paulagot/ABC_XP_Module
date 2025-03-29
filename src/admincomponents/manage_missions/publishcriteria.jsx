import React, { useState, useEffect } from 'react';
import axios from 'axios';


/**
 * PublishCriteria Component
 * 
 * This component checks if the mission meets the criteria for publishing.
 * It updates the message displayed to the user based on whether the mission can be published.
 * 
 * Props:
 * - missionId: The ID of the mission being checked.
 * - setCanPublish: Function to update the canPublish state in the parent component.
 * - published: Boolean indicating whether the mission is already published.
 */
const PublishCriteria = ({ missionId, setCanPublish, published }) => {
  const [criteriaCount, setCriteriaCount] = useState(0);
  const [criteriaMessage, setCriteriaMessage] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/criteria/mission/${missionId}`);
        const count = response.data.length;
  
        const missionResponse = await axios.get(`${API_BASE_URL}/api/missions/${missionId}`);
     
        const hasLandingPage = !!missionResponse.data.landing_page_url;
  
        setCriteriaCount(count);
        setCanPublish(count > 0 && hasLandingPage);
  
        // Update the message based on the criteria count, publish status, and landing page
        if (published) {
          setCriteriaMessage('This mission is published.');
        } else if (count > 0 && hasLandingPage) {
          setCriteriaMessage('This mission meets the criteria for publishing.');
        } else if (!hasLandingPage) {
          setCriteriaMessage('This mission needs a landing page URL to be published.');
        } else {
          setCriteriaMessage('This mission does not meet the criteria for publishing.');
        }
      } catch (error) {
        console.error('Error fetching criteria:', error);
        setCanPublish(false);
        setCriteriaMessage('Error fetching criteria.');
      }
    };
  
    if (missionId) {
      fetchCriteria();
    }
  }, [missionId, setCanPublish, published]);
  

  return (
    <div>
      <p>{criteriaMessage}</p>
    </div>
  );
};

export default PublishCriteria;