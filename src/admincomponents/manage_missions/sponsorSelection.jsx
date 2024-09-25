import React from 'react';
/**
 * SponsorSelection Component
 * 
 * This component is responsible for rendering a dropdown selection for sponsors.
 * 
 * Props:
 * - sponsorData: Array of sponsor objects to populate the dropdown options.
 * - selectedSponsor: The currently selected sponsor ID.
 * - handleSponsorChange: Function to handle the selection change.
 */

const SponsorSelection = ({ sponsorData = [], selectedSponsor = '', handleSponsorChange }) => {
  return (
    <div id="sponsorSelectionMissions">
      <label htmlFor="includeSponsor">Sponsor:</label>
      <select
        name="includeSponsor"
        id="includeSponsor"
        value={selectedSponsor}
        onChange={handleSponsorChange}
      >
        <option value="" disabled>Select your option</option>
        {sponsorData.map((sponsor) => (
          <option key={sponsor.sponsor_id} value={sponsor.sponsor_id}>
            {sponsor.name}
          </option>
        ))}
        <option value="null">None</option> {/* None option remains */}
      </select>
    </div>
  );
};

export default SponsorSelection;



