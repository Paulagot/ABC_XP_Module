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
const MissionForm = memo(({ missionData, sponsorData, chainData, closeForm, subcategoryData, openManageChains, openManageSponsors, openManageSubcategories }) => {
  // State for managing form data
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

  // State to manage whether the mission can be published
  const [canPublish, setCanPublish] = useState(false);

  // State for managing messages displayed to the user
  const [message, setMessage] = useState('');
  
  // State to control the visibility of the popup
  const [showPopup, setShowPopup] = useState(false);

  /**
   * useEffect to populate form data when missionData is updated.
   */
  useEffect(() => {
    if (missionData) {
      setFormData({
        missionsName: missionData.name || '',
        subtitle: missionData.subtitle || '',
        xp: missionData.xp || '',
        thumbnail: missionData.thumbnail || '',
        mission_url: missionData.mission_url || '',
        sponsor_id: missionData.sponsor_id || '',
        published: missionData.published === 1, // Correctly populate the checkbox
        chain_id: missionData.chain_id || '',
        subcategory_id: missionData.subcategory_id || '',
      });
    }
  }, [missionData]);

  /**
   * handleInputChange
   * 
   * Handles changes to the input fields in the form.
   * 
   * @param {Event} e - The input change event.
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  /**
   * handleSponsorChange
   * 
   * Handles changes to the sponsor dropdown selection.
   * 
   * @param {Event} e - The dropdown selection change event.
   */
  const handleSponsorChange = useCallback((e) => {
    setFormData((prevData) => ({ ...prevData, sponsor_id: e.target.value === 'null' ? null : e.target.value }));
  }, []);

  /**
   * handleChainChange
   * 
   * Handles changes to the chain dropdown selection.
   * 
   * @param {Event} e - The dropdown selection change event.
   */
  const handleChainChange = useCallback((e) => {
    setFormData((prevData) => ({ ...prevData, chain_id: e.target.value === 'null' ? null : e.target.value }));
  }, []);

  /**
   * handleSubcategoryChange
   * 
   * Handles changes to the subcategory dropdown selection.
   * 
   * @param {Event} e - The dropdown selection change event.
   */
  const handleSubcategoryChange = useCallback((e) => {
    setFormData((prevData) => ({ ...prevData, subcategory_id: e.target.value === 'null' ? null : e.target.value }));
  }, []);

  /**
   * resetForm
   * 
   * Resets the form fields to their initial state and closes the form.
   */
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
    closeForm(); // Return to the search view by closing the form
  };

  /**
   * clearEditableFields
   * 
   * Clears the editable fields in the form, setting them to their default values.
   */
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

  /**
   * handleFormSubmit
   * 
   * Handles the form submission, sends data to the backend API, and displays the appropriate success or error message.
   * 
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Ensure that a subcategory is selected
    if (!formData.subcategory_id) {
      alert('Subcategory must be selected.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/missions/${missionData.mission_id}`, {
        xp: formData.xp,
        sponsor_id: formData.sponsor_id === 'null' ? null : formData.sponsor_id,
        chain_id: formData.chain_id === 'null' ? null : formData.chain_id,
        subcategory_id: formData.subcategory_id,
        published: formData.published && canPublish ? 1 : 0, // Only publish if criteria are met
      });

      if (response.status === 200) {
        let successMessage = 'Mission updated successfully.';
        if (formData.published && canPublish) {
          successMessage += ' Mission published successfully.';
        }
        setMessage(successMessage);
        setShowPopup(true); // Show success popup
      }
    } catch (error) {
      console.error('Error updating mission:', error);
      alert('Failed to update mission. Please try again.');
    }
  };

  /**
   * handleClosePopup
   * 
   * Closes the success message popup and resets the form.
   */
  const handleClosePopup = () => {
    setShowPopup(false); // Hide popup
    resetForm(); // Return to the search view
  };

  return (
    <div id="missionForm">
      {/* Render mission details component */}
      <MissionDetails formData={formData} handleInputChange={handleInputChange} disableFields={true} />
      
      {/* Render sponsor selection dropdown */}
      <SponsorSelection
        sponsorData={sponsorData}
        selectedSponsor={formData.sponsor_id}
        handleSponsorChange={handleSponsorChange}
      />

      {/* Render chain selection dropdown */}
      <ChainSelection
        chainData={chainData}
        selectedChain={formData.chain_id}
        handleChainChange={handleChainChange}
      />

      {/* Render subcategory selection dropdown */}
      <SubcategorySelection
        subcategoryData={subcategoryData}
        selectedSubcategory={formData.subcategory_id}
        handleSubcategoryChange={handleSubcategoryChange}
      />

      {/* Render publish status component */}
      <PublishStatus
        isPublished={formData.published}
        handlePublishChange={(e) => {
          // Only allow the checkbox to be checked if mission meets criteria
          if (canPublish) {
            setFormData({ ...formData, published: e.target.checked });
          } else {
            alert('This mission does not meet the criteria for publishing.');
          }
        }}
        canPublish={canPublish} // Pass canPublish to control checkbox disabling
      />

      {/* Render publish criteria component */}
      <PublishCriteria missionId={missionData.mission_id} setCanPublish={setCanPublish} published={formData.published} />

      {/* Render form action buttons */}
      <div id="missionFormButtons">
        <button type="button" onClick={handleFormSubmit} disabled={!canPublish && formData.published}>
          Save Mission
        </button>
        <button type="button" onClick={resetForm}>Reset Form</button>
        <button type="button" onClick={clearEditableFields}>Clear Editable Fields</button>
        <button type="button" onClick={openManageChains}>Manage Chains</button>
        <button type="button" onClick={openManageSponsors}>Manage Sponsors/Partners</button>
        <button type="button" onClick={openManageSubcategories}>Manage Subcategories</button>
      </div>

      {/* Display success/error popup */}
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