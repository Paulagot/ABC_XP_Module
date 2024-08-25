import React, { useState, memo, useEffect, useCallback } from 'react';
import MissionDetails from './missionDetails.jsx';
import SponsorSelection from './sponsorSelection.jsx';
import ChainSelection from './chainSelection.jsx';
import PublishStatus from "./publishedStatus.jsx";
import SubcategorySelection from './subcategorySelection.jsx';
import axios from 'axios';

const MissionForm = memo(({ missionData, sponsorData, chainData, closeForm, subcategoryData }) => {
  console.log('MissionForm component mounted');  // Debugging line
  const [formData, setFormData] = useState({
    missionsName: '',
    subtitle: '',
    xp: '',
    thumbnail: '',
    mission_url: '',
    sponsor_id: '',
    published: false,
    subcategory_id: '',
    chain_id: '',
  });

  useEffect(() => {
    if (missionData) {
      setFormData({
        missionsName: missionData.name || '',
        subtitle: missionData.subtitle || '',
        xp: missionData.xp || '',
        thumbnail: missionData.thumbnail || '',
        mission_url: missionData.mission_url || '',
        sponsor_id: missionData.sponsor_id || '',
        published: missionData.publish === 1,
        chain_id: missionData.chain_id || '',
        subcategory_id : missionData.subcategory_id || '',
      });
    }
  }, [missionData]);

  // Memoized event handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSponsorChange = useCallback((e) => {
    const selectedValue = e.target.value;
    console.log("Selected Sponsor ID:", selectedValue);
    setFormData((prevData) => ({ ...prevData, sponsor_id: selectedValue === "null" ? null : selectedValue }));
  }, []);

  const handleChainChange = useCallback((e) => {
    const selectedCValue = e.target.value;
    console.log("Selected Sponsor chain", selectedCValue);
    setFormData((prevData) => ({ ...prevData, chain_id: selectedCValue === "null" ? null : selectedCValue }));
  }, []);

  const handleSubcategoryChange = useCallback((e) => {
    const selectedSubValue = e.target.value;
    console.log("Selected SubcategoryID:", selectedSubValue);
    setFormData((prevData) => ({ ...prevData, subcategory_id: selectedSubValue === "null" ? null : selectedSubValue }));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Validate XP to be a whole number
    const validateXP = (xp) => {
      const xpValue = parseInt(xp, 10);
      if (isNaN(xpValue) || xpValue < 0) {
        alert('Please enter a valid whole number for XP.');
        return false;
      }
      return true;
    };
  
    if (!validateXP(formData.xp)) {
      return;
    }
  
    if (!formData.sponsor_id) {
      alert('Sponsor must be selected.');
      return;
    }
  
    if (!formData.chain_id) {
      alert('Chain must be selected.');
      return;
    }
  
    if (!formData.subcategory_id) {
      alert('Subcategory must be selected.');
      return;
    }
  
    try {
      // Sending PUT request to update the mission in the database
      const response = await axios.put(`http://localhost:3000/api/missions/${missionData.mission_id}`, {
        xp: formData.xp,
        sponsor_id: formData.sponsor_id,
        chain_id: formData.chain_id,
        subcategory_id: formData.subcategory_id,
        published: formData.published ? 1 : 0,  // Convert to tinyint
      });
  
      if (response.status === 200) {
        alert('Mission updated successfully!');
        closeForm(); // Close the form after successful update
      }
    } catch (error) {
      console.error('Error updating mission:', error);
      alert('Failed to update mission. Please try again.');
    }
  };

  return (
    <div id="missionForm">
      <MissionDetails formData={formData} handleInputChange={handleInputChange} />
      <SponsorSelection
        sponsorData={sponsorData}
        selectedSponsor={formData.sponsor_id}
        handleSponsorChange={handleSponsorChange}
      />
      <ChainSelection
        chainData={chainData}
        selectedChain={formData.chain_id}
        handleChainChange={handleChainChange}
      />
      <SubcategorySelection
        subcategoryData={subcategoryData}
        selectedSubcategory={formData.subcategory_id}
        handleSubcategoryChange={handleSubcategoryChange}
      />
      <PublishStatus
        isPublished={formData.published}
        handlePublishChange={(e) => setFormData({ ...formData, published: e.target.checked })}
      />
      <div id="missionFormButtons">
        <button type="button" onClick={handleFormSubmit}>Save Mission</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </div>
    </div>
  );
});
export default MissionForm;