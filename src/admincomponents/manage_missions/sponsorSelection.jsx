import React from 'react';

const SponsorSelection = ({ sponsorData = [], selectedSponsor = '', handleSponsorChange }) => {
  console.log('Sponsor data:', sponsorData); // Log to ensure it's defined

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
        {Array.isArray(sponsorData) && sponsorData.map((sponsor) => (
          // Add a check to ensure sponsor is not undefined
          sponsor && sponsor.sponsor_id && (
            <option key={sponsor.sponsor_id} value={sponsor.sponsor_id}>
              {sponsor.name} {/* Display name */}
            </option>
          )
        ))}
        <option value="null">None</option> {/* Add None option */}
      </select>
    </div>
  );
};

export default SponsorSelection;


