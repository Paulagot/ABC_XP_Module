import React, { useState, useEffect } from 'react';

/**
 * Addnewmission component
 * 
 * This component is used to add or edit a mission. It includes various fields such as mission name, subtitle, experience points, etc.
 * It also provides dynamic fields based on the selected criteria type.
 * 
 * Props:
 * - closeForm: Function to handle closing the form
 * - validateMissionsForm: Function to validate the form data
 */
const AddNewMission = ({ closeForm, validateMissionsForm }) => {
  // State to manage the selected criteria type
  const [criteriaType, setCriteriaType] = useState('');
  
  // State to manage the visibility of dynamic fields based on criteria type
  const [criteriaBiteDisplay, setCriteriaBiteDisplay] = useState('none');
  const [criteriaSubCategoryDisplay, setCriteriaSubCategoryDisplay] = useState('none');
  const [lpRequiredDisplay, setLpRequiredDisplay] = useState('none');

  /**
   * useEffect hook to manage the visibility of dynamic fields
   * based on the selected criteria type
   */
  useEffect(() => {
    if (criteriaType === 'BiteComplete') {
      setCriteriaBiteDisplay('block');
      setCriteriaSubCategoryDisplay('none');
      setLpRequiredDisplay('none');
    } else if (criteriaType === 'LP is') {
      setCriteriaBiteDisplay('none');
      setCriteriaSubCategoryDisplay('block');
      setLpRequiredDisplay('block');
    } else {
      setCriteriaBiteDisplay('none');
      setCriteriaSubCategoryDisplay('none');
      setLpRequiredDisplay('none');
    }
  }, [criteriaType]);

  /**
   * Handles the change in criteria type dropdown
   * Updates the criteriaType state and triggers visibility changes
   * 
   * @param {Object} e - Event object
   */
  const handleCriteriaTypeChange = (e) => {
    setCriteriaType(e.target.value);
  };

  return (
    <div id="addMissionsForm">
      {/* Close button to close the form */}
      <span id="closeNewMissionsFormBtn" className="closeButton" onClick={closeForm}>×</span>
      <h2>Add Mission</h2>
      <form onSubmit={validateMissionsForm}>
        {/* Missions Name Field */}
        <label htmlFor="missionsName">Missions Name:</label>
        <input
          type="text"
          id="missionsName"
          name="missionsName"
          placeholder="Enter Missions Name"
          required
        /><br /><br />

        {/* Missions Subtitle Field */}
        <label htmlFor="subtitle">Subtitle:</label>
        <textarea
          id="subtitle"
          name="subtitle"
          placeholder="Enter subtitle"
        ></textarea><br /><br />

        {/* Mission Experience Points Field */}
        <label htmlFor="XpPoints">Mission Experience Points:</label>
        <input
          type="number"
          id="XpPoints"
          name="XpPoints"
          placeholder="Enter Mission Experience Points"
          required
        /><br /><br />

        {/* Mission Image URL Field */}
        <label htmlFor="missionImage">Mission Image URL:</label>
        <input
          type="url"
          id="missionsImage"
          name="missionsImage"
        /><br /><br />

        {/* Mission URL Field */}
        <label htmlFor="missionsURL">Mission URL:</label>
        <input
          type="url"
          id="missionsURL"
          name="missionsURL"
        /><br /><br />

        {/* Dynamic Sponsor Name Field */}
        <div id="sponsorSelectionMissions">
          <div className="sponsorEntry">
            <label htmlFor="includeSponsor">Sponsor:</label>
            <select name="includeSponsor">
              <option value="" disabled selected>Select your option</option>
              <option value="sponsor1">As per DB</option>
              <option value="sponsor2">As per DB</option>
              <option value="sponsor3">As per DB</option>
              <option value="sponsor4">As per DB</option>
            </select><br /><br />
          </div>
        </div>

        {/* Criteria Section */}
        <h3>Set Criteria</h3>
        {/* Match Type Dropdown */}
        <label htmlFor="criteriaMatch">Criteria must match:</label>
        <select name="matchType">
          <option value="" disabled selected>Select your option</option>
          <option value="All">ALL</option>
          <option value="Any">ANY</option>
        </select><br /><br />

        {/* Criteria Type Dropdown */}
        <div className="criteriaType">
          <label htmlFor="criteriaTypeMatch">Select Criteria Type</label>
          <select name="matchTypeMatch" onChange={handleCriteriaTypeChange}>
            <option value="" disabled selected>Select your option</option>
            <option value="BiteComplete">Bite Complete</option>
            <option value="LP is">LP is</option>
          </select><br /><br />
        </div>

        {/* Dynamic select required bites field */}
        <div
          className="criteriaBiteSelection"
          id="criteriaBiteSelection"
          style={{ display: criteriaBiteDisplay }}
        >
          <label htmlFor="criteriaBiteMatch">Select Bite</label>
          <select name="matchBiteMatch">
            <option value="" disabled selected>Select your option</option>
            <option value="name of bite">From DB</option>
            <option value="name of bite">From DB</option>
          </select><br /><br />
        </div>

        {/* Dynamic select required Subcategories field */}
        <div
          className="criteriaSubCategorySelection"
          id="criteriaSubCategorySelection"
          style={{ display: criteriaSubCategoryDisplay }}
        >
          <label htmlFor="criteriaSubCategoryMatch">Select Sub-Category</label>
          <select name="matchSubCategoryMatch">
            <option value="" disabled selected>Select your option</option>
            <option value="name of subcategory">From DB</option>
            <option value="name of subcategory">From DB</option>
          </select><br /><br />
        </div>

        {/* LP Required Field */}
        <div
          className="lpRequired"
          id="lpRequired"
          style={{ display: lpRequiredDisplay }}
        >
          <label htmlFor="lpRequired">LP Required:</label>
          <input
            type="number"
            id="lpRequired"
            name="lpRequired"
          /><br /><br />
        </div>

        <button id="addCriteriaBtn">Add More Criteria</button> 

        {/*-- Change status of missions */}
                <div class="publishStatus">
                    <label for="publishMissions" class="formlabel">Publish Category</label>
                    <input type="checkbox" id="publishMissions" class="formCheckBox" unchecked/>
                  
                </div>

        {/* Submit Button */}
        <input type="submit" value="Save" />
      </form>
    </div>
  );
};

export default AddNewMission;
