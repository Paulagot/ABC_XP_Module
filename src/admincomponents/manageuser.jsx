import React from "react";

/**
 * Manage Users component
 * 
 * This component is responsible for rendering the popup for managing users
 * 
 * Props:
 * - closePopup: Function to handle closing the popup
 * - openAddNewUser: Function to handle opening the add new mission form
 */
const searchUsers = () => {/* Search users functionality */};

const ManageUsers = ({ closePopup, openAddNewUser }) => {
  return (
         <div id="manageUser" className="manageUserPopup">
        <span id="closeManageUserPopupBtn" className="closeButton" onClick={closePopup}>×</span>
        <h2>Manage Users</h2>
        <div className="searchContainer">
        <input type="text" id="searchBar" placeholder="Search by student email..." />
        <button type="button" id="searchMissionsBtn" className="searchButton" onClick={searchUsers}>Search</button>
        </div>
        <div id="userDetails">
        <p>User details will be populated around here</p>
        </div>
        <button id="addNewUserBtn" className="formButton" onClick={openAddNewUser}>Add New User</button>
        </div>
  );
};

export default ManageUsers;