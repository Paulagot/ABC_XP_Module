import React, { useState, useEffect } from 'react';

/**
 * Addnewpartner component
 * 
 * This component is used to add or edit a partner 
 * It also provides dynamic fields based on the selected criteria type.
 * 
 * Props:
 * - closeForm: Function to handle closing the form
 * - validatePartnerForm: Function to validate the form data
 */
const AddNewPartner = ({ closeForm, validatePartnerForm }) => {
 
  return (
    <div id="addPartnerForm">
          <span id="closeNewPartnerFormBtn" className="closeButton" onClick={closeForm}>×</span>
          <h2>Add Partner</h2>
          <form onSubmit={validatePartnerForm}>
            <label htmlFor="partnerName">Partner Name:</label>
            <input type="text" id="partnerName" name="partnerName" placeholder="Enter Partner Name" required /><br /><br />

            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" placeholder="Enter description"></textarea><br /><br />

            <input type="submit" value="Save" />
          </form>
        </div>
  );
};

export default AddNewPartner;