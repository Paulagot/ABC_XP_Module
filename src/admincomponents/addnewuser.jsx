import React, { useState, useEffect } from 'react';

/**
 * AddnewUser component
 * 
 * This component is used to add or edit a user. 
 * It also provides dynamic fields based on the selected criteria type.
 * 
 * Props:
 * - closeForm: Function to handle closing the form
 * - validateusersForm: Function to validate the form data
 */
const AddNewUser = ({ closePopup, validateUserForm }) => {
 
  return (
    <div id="userForm">
    <span id="closeFormBtn" className="closeButton" onClick={closePopup}>×</span>
    <h2>Add New User</h2>
    <form onSubmit={validateUserForm }>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" pattern="[A-Za-z]+" placeholder="Enter Name (Letters only)" required /><br /><br />

      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" placeholder="Enter Email Address" required /><br /><br />

      <input type="submit" value="Save" />
    </form>
  </div>
    
  );
};

export default AddNewUser;