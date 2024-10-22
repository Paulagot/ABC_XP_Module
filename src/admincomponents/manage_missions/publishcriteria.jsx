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

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const response = await axios.get(`http://16.171.3.129:3000/api/criteria/mission/${missionId}`);
        const count = response.data.length;
        setCriteriaCount(count);
        setCanPublish(count > 0);

        // Update the message based on the criteria count and publish status
        if (published) {
          setCriteriaMessage('This mission is published.');
        } else if (count > 0) {
          setCriteriaMessage('This mission meets the criteria for publishing.');
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