import React, { useState, useEffect } from 'react';

/**
 * Addnewbite component
 * 
 * This component is used to add or edit a bite. 
 * It also provides dynamic fields based on the selected criteria type.
 * 
 * Props:
 * - closeForm: Function to handle closing the form
 * - validateBitesForm: Function to validate the form data
 */
const AddNewBite = ({ closePopup, validateBiteForm }) => {
 
  return (
    <div id="addBitesForm">
          <span id="closeNewBitesFormBtn" className="closeButton" onClick={closePopup}>×</span>
          <h2>Add Bite</h2>
          <form onSubmit={validateBiteForm}>
            <label htmlFor="biteName">Bite Name:</label>
            <input type="text" id="biteName" name="biteName" placeholder="Enter Bite Name" required /><br /><br />

            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" placeholder="Enter description"></textarea><br /><br />

            <label htmlFor="category">Category:</label>
            <input type="text" id="category" name="category" placeholder="Link with a category" required /><br /><br />

            <label htmlFor="biteImage">Bite Image:</label>
            <input type="url" id="biteImage" name="biteImage" placeholder="Enter Bite image url" required /><br /><br />

            <label htmlFor="partner">Partner:</label>
            <input type="text" id="partner" name="partner" placeholder="partner" required /><br /><br />

            <label htmlFor="biteURL">Bite Sales Page:</label>
            <input type="url" id="biteURL" name="biteURL" placeholder="Enter Bite url" required /><br /><br />

            <label htmlFor="bitePlayerURL">Bite Player Page:</label>
            <input type="url" id="bitePlayerURL" name="bitePlayerURL" placeholder="Enter Bite player url" required /><br /><br />

            <div className="publish-bites__status">
              <label htmlFor="publishBites" className="form__label">Publish Bite</label>
              <input type="checkbox" id="publishBite" className="form__checkbox" />
            </div>

            <input type="submit" value="Save" />
          </form>
        </div>
    
  );
};

export default AddNewBite;