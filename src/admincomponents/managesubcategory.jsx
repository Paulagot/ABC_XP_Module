import React from "react";

/**
 * Manage subCategory component
 * 
 * This component is responsible for rendering the popup for managing subCategory
 * 
 * Props:
 * - closePopup: Function to handle closing the popup
 * - openAddNewSubCategory: Function to handle opening the add new subCategory form
 */
const searchSubCategory = () => {/* Search users functionality */};

const ManageSubCategory = ({ closePopup, openAddNewSubCategory }) => {
  return (
    <div id="manageSubCategory" className="manageSubCategoryPopup">
    <span id="closeManageSubCategoryPopupBtn" className="closeButton" onClick={closePopup}>×</span>
    <h2>Manage Sub-Categories</h2>
    <div className="searchContainer">
      <input type="text" id="searchBar" placeholder="Search by sub-category..." />
      <button type="button" id="searchSubCategoryBtn" className="searchButton" onClick={searchSubCategory}>Search</button>
    </div>
    <div id="subCategoryDetails">
      <p>All sub-categories will be listed here with a scroll</p>
    </div>
    <button type="button" id="addNewSubCategoryBtn" className="formButton" onClick={openAddNewSubCategory}>Add New Bite</button>
  </div>
  );
};

export default ManageSubCategory;