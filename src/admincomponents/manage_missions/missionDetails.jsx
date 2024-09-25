import React from 'react';

/**
 * MissionDetails Component
 * 
 * This component renders the input fields for mission details such as name, subtitle, XP, thumbnail, and mission URL.
 * 
 * Props:
 * - formData: An object containing the current values of the mission details.
 * - handleInputChange: Function to handle input changes for the mission details.
 * - disableFields: A boolean indicating whether the fields should be disabled.
 */
const MissionDetails = ({ formData, handleInputChange, disableFields }) => {
  return (
    <div id="missionDetails">
      <label htmlFor="missionsName">Mission Name:</label>
      <input
        type="text"
        id="missionsName"
        name="missionsName"
        value={formData.missionsName || ''}
        onChange={handleInputChange}
        disabled={disableFields} // Disables the field based on the disableFields prop
      /><br /><br />

      <label htmlFor="subtitle">Subtitle:</label>
      <input
        type="text"
        id="subtitle"
        name="subtitle"
        value={formData.subtitle || ''}
        onChange={handleInputChange}
        disabled={disableFields} // Disables the field based on the disableFields prop
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
        disabled={disableFields} // Disables the field based on the disableFields prop
      /><br /><br />

      <label htmlFor="mission_url">Mission URL:</label>
      <input
        type="text"
        id="mission_url"
        name="mission_url"
        value={formData.mission_url || ''}
        onChange={handleInputChange}
        disabled={disableFields} // Disables the field based on the disableFields prop
      /><br /><br />
    </div>
  );
};

export default MissionDetails;


