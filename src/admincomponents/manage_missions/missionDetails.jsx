import React from 'react';

const MissionDetails = ({ formData, handleInputChange }) => {
  // Ensure default values for each input to avoid undefined values
  return (
    <div id="missionDetails">
      <label htmlFor="missionsName">Mission Name:</label>
      <input
        type="text"
        id="missionsName"
        name="missionsName"
        value={formData.missionsName || ''}
        onChange={handleInputChange}
      /><br /><br />

      <label htmlFor="subtitle">Subtitle:</label>
      <input
        type="text"
        id="subtitle"
        name="subtitle"
        value={formData.subtitle || ''}
        onChange={handleInputChange}
      /><br /><br />

      <label htmlFor="xp">XP:</label>
      <input
        type="number"
        id="xp"
        name="xp"
        value={formData.xp || ''}
        onChange={handleInputChange}
      /><br /><br />

      <label htmlFor="thumbnail">Thumbnail URL:</label>
      <input
        type="text"
        id="thumbnail"
        name="thumbnail"
        value={formData.thumbnail || ''}
        onChange={handleInputChange}
      /><br /><br />

      <label htmlFor="mission_url">Mission URL:</label>
      <input
        type="text"
        id="mission_url"
        name="mission_url"
        value={formData.mission_url || ''}
        onChange={handleInputChange}
      /><br /><br />
    </div>
  );
};

export default MissionDetails;

