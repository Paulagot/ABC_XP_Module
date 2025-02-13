import React, { useState, memo, useEffect, useCallback } from 'react';
import MissionDetails from './missionDetails.jsx';
import SponsorSelection from './sponsorSelection.jsx';
import ChainSelection from './chainSelection.jsx';
import PublishStatus from "./publishedStatus.jsx";
import SubcategorySelection from './subcategorySelection.jsx';
import PublishCriteria from './publishcriteria.jsx';
import axios from 'axios';


/**
 * MissionForm Component
 * 
 * This component renders the form for managing a mission, including details, sponsor selection, chain selection, and subcategory selection.
 * It also handles form submission and displays success or error messages based on the submission result.
 * 
 * Props:
 * - missionData: The data for the selected mission.
 * - sponsorData: Array of sponsor objects to populate the sponsor dropdown.
 * - chainData: Array of chain objects to populate the chain dropdown.
 * - subcategoryData: Array of subcategory objects to populate the subcategory dropdown.
 * - closeForm: Function to close the form and reset to the search view.
 * - openManageChains: Function to open the Manage Chains popup.
 * - openManageSponsors: Function to open the Manage Sponsors/Partners popup.
 * - openManageSubcategories: Function to open the Manage Subcategories popup.
 */
const MissionForm = memo(({ 
  missionData, 
  sponsorData, 
  chainData, 
  closeForm, 
  subcategoryData, 
  openManageChains, 
  openManageSponsors, 
  openManageSubcategories, 
  openAddCriteria, // New prop for Add Criteria button
  openLandingPageEditor // New prop for Add Landing Page button
}) => {
  
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

  const [canPublish, setCanPublish] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Populate form data when missionData changes
  useEffect(() => {
    if (missionData) {
      setFormData({
        missionsName: missionData.name || '',
        subtitle: missionData.subtitle || '',
        xp: missionData.xp || '',
        thumbnail: missionData.thumbnail || '',
        mission_url: missionData.mission_url || '',
        sponsor_id: missionData.sponsor_id || '',
        published: missionData.published === 1,
        chain_id: missionData.chain_id || '',
        subcategory_id: missionData.subcategory_id || '',
      });
    }
  }, [missionData]);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subcategory_id) {
      alert('Subcategory must be selected.');
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.put(`${API_BASE_URL}/api/missions/${missionData.mission_id}`, {
        xp: formData.xp,
        sponsor_id: formData.sponsor_id === 'null' ? null : formData.sponsor_id,
        chain_id: formData.chain_id === 'null' ? null : formData.chain_id,
        subcategory_id: formData.subcategory_id,
        published: formData.published && canPublish ? 1 : 0,
        
      });

      if (response.status === 200) {
        let successMessage = 'Mission updated successfully.';
        if (formData.published && canPublish) {
          successMessage += ' Mission published successfully.';
        }
        setMessage(successMessage);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error updating mission:', error);
      alert('Failed to update mission. Please try again.');
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
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
    closeForm(); // Return to the search view
  };

  // Clear editable fields
  const clearEditableFields = () => {
    setFormData((prevData) => ({
      ...prevData,
      xp: '',
      sponsor_id: '',
      chain_id: '',
      subcategory_id: '',
      published: false,
    }));
  };

  // Close success popup
  const handleClosePopup = () => {
    setShowPopup(false);
    closeForm();
  };

  return (
    <div id="missionForm">
      {/* Mission Details */}
      <MissionDetails formData={formData} handleInputChange={(e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }} disableFields={true} />

      {/* Sponsor Selection */}
      <SponsorSelection
        sponsorData={sponsorData}
        selectedSponsor={formData.sponsor_id}
        handleSponsorChange={(e) =>
          setFormData((prevData) => ({
            ...prevData,
            sponsor_id: e.target.value === 'null' ? null : e.target.value,
          }))
        }
      />

      {/* Chain Selection */}
      <ChainSelection
        chainData={chainData}
        selectedChain={formData.chain_id}
        handleChainChange={(e) =>
          setFormData((prevData) => ({
            ...prevData,
            chain_id: e.target.value === 'null' ? null : e.target.value,
          }))
        }
      />

      {/* Subcategory Selection */}
      <SubcategorySelection
        subcategoryData={subcategoryData}
        selectedSubcategory={formData.subcategory_id}
        handleSubcategoryChange={(e) =>
          setFormData((prevData) => ({
            ...prevData,
            subcategory_id: e.target.value === 'null' ? null : e.target.value,
          }))
        }
      />

      {/* Publish Status */}
      <PublishStatus
        isPublished={formData.published}
        handlePublishChange={(e) => {
          if (canPublish) {
            setFormData({ ...formData, published: e.target.checked });
          } else {
            alert('This mission does not meet the criteria for publishing.');
          }
        }}
        canPublish={canPublish}
      />

      {/* Publish Criteria */}
      <PublishCriteria
        missionId={missionData.mission_id}
        setCanPublish={setCanPublish}
        published={formData.published}
      />

      {/* Buttons */}
      <div id="missionFormButtons">
        <button type="button" onClick={handleFormSubmit} disabled={!canPublish && formData.published}>
          Save Mission
        </button>
        <button type="button" onClick={resetForm}>Reset Form</button>
        <button type="button" onClick={clearEditableFields}>Clear Editable Fields</button>
        <button type="button" onClick={openManageChains}>Manage Chains</button>
        <button type="button" onClick={openManageSponsors}>Manage Sponsors/Partners</button>
        <button type="button" onClick={openManageSubcategories}>Manage Subcategories</button>
        <button type="button" onClick={openAddCriteria}>Add Criteria</button>
        {/* <button type="button" onClick={openLandingPageEditor}>Add Landing Page</button> */}
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{message}</p>
            <button onClick={handleClosePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default MissionForm;
