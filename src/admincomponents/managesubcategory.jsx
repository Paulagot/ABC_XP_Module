import React, { useState } from "react";
import axios from 'axios';

/**
 * ManageSubCategory component
 * 
 * This component is responsible for performing CRUD operations on subcategories.
 * 
 * Props:
 * - closePopup: Function to handle closing the popup.
 */

const ManageSubCategory = ({ closePopup }) => {
    // State variables to manage form inputs and search results
    const [subcategoryId, setSubcategoryId] = useState(null); // Stores the ID of the selected subcategory
    const [name, setName] = useState(''); // Stores the name of the subcategory
    const [searchQuery, setSearchQuery] = useState(''); // Stores the current search query
    const [searchResults, setSearchResults] = useState([]); // Stores the search results returned from the API
    const [message, setMessage] = useState(''); // Stores feedback messages for the user
    const [showConfirmation, setShowConfirmation] = useState(false); // Controls the visibility of the delete confirmation popup
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    /**
     * searchSubCategory
     * 
     * Sends a GET request to the backend API to search for subcategories based on the query.
     * 
     * @param {string} query - The search query entered by the user.
     */
    const searchSubCategory = async (query) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/subcategories/search?q=${query}`);
           
            setSearchResults(response.data); // Update search results state with the data received
        } catch (error) {
            console.error('There was an error searching subcategories!', error);
            setMessage('Error searching subcategories');
        }
    };

    /**
     * addSubCategory
     * 
     * Sends a POST request to the backend API to add a new subcategory with the provided details.
     * 
     * @param {Event} event - The form submission event.
     */
    const addSubCategory = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/api/subcategories`, { name });
            setMessage(`Subcategory created successfully with ID: ${response.data.id}`);
            resetForm(); // Reset form fields after successful creation
        } catch (error) {
            console.error('There was an error creating the subcategory!', error);
            handleError(error, 'Error creating subcategory');
        }
    };

    /**
     * updateSubCategory
     * 
     * Sends a PUT request to the backend API to update an existing subcategory.
     * 
     * @param {Event} event - The form submission event.
     */
    const updateSubCategory = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`${API_BASE_URL}/api/subcategories/${subcategoryId}`, { name });
            setMessage(`Subcategory updated successfully to "${name}"`);
            resetForm(); // Reset form fields after successful update
        } catch (error) {
            console.error('There was an error updating the subcategory!', error);
            handleError(error, 'Error updating subcategory');
        }
    };

    /**
     * deleteSubCategory
     * 
     * Sends a DELETE request to the backend API to remove the selected subcategory.
     */
    const deleteSubCategory = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/api/subcategories/${subcategoryId}`);
            setMessage('Subcategory deleted successfully');
            resetForm(); // Reset form fields after successful deletion
            setShowConfirmation(false); // Close the confirmation popup
        } catch (error) {
            console.error('There was an error deleting the subcategory!', error);
            setMessage('Error deleting subcategory');
        }
    };

    /**
     * selectSubCategory
     * 
     * Populates the form fields with data from the selected subcategory.
     * 
     * @param {Object} subcategory - The selected subcategory object.
     */
    const selectSubCategory = (subcategory) => {
        setSubcategoryId(subcategory.subcategory_id);
        setName(subcategory.name);
        setSearchResults([]);
        setSearchQuery('');
    };

    /**
     * resetForm
     * 
     * Resets all form fields and related state variables to their initial empty states.
     */
    const resetForm = () => {
        setSubcategoryId(null);
        setName('');
    };

    /**
     * handleDeleteClick
     * 
     * Triggers the display of the delete confirmation popup.
     */
    const handleDeleteClick = () => {
        setShowConfirmation(true);
    };

    /**
     * handleCancelDelete
     * 
     * Closes the delete confirmation popup without performing any action.
     */
    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    /**
     * handleError
     * 
     * Centralized error handling function to process and display error messages.
     * 
     * @param {Object} error - The error object received from the API or the catch block.
     * @param {string} defaultMessage - The default message to display if the error is not recognized.
     */
    const handleError = (error, defaultMessage) => {
        if (error.response && error.response.data && error.response.data.error) {
            setMessage(error.response.data.error);
        } else {
            setMessage(defaultMessage);
        }
    };

    /**
     * clearMessageOnInteraction
     * 
     * Clears the message state when the user interacts with the form or performs a search.
     */
    const clearMessageOnInteraction = () => {
        setMessage('');
    };

    return (
        <div id="manageSubCategory" className="manageSubCategoryPopup">
            <span id="closeManageSubCategoryPopupBtn" className="closeButton" onClick={closePopup}>×</span>
            <h2>Manage Sub-Categories</h2>
            
            <div className="searchContainer">
                <input
                    type="text"
                    id="searchBar"
                    placeholder="Search by sub-category..."
                    value={searchQuery}
                    onChange={(e) => {
                        clearMessageOnInteraction();
                        setSearchQuery(e.target.value);
                        searchSubCategory(e.target.value, setSearchResults);
                    }}
                />
                <button
                    type="button"
                    id="searchSubCategoryBtn"
                    className="searchButton"
                    onClick={() => {
                        clearMessageOnInteraction();
                        searchSubCategory(searchQuery, setSearchResults);
                    }}
                >
                    Search
                </button>

                {searchResults.length > 0 && (
                    <ul className="searchResults">
                        {searchResults.map((subcategory) => (
                            <li
                                key={subcategory.subcategory_id}
                                onClick={() => {
                                    clearMessageOnInteraction();
                                    selectSubCategory(subcategory);
                                }}
                                className="searchResultItem"
                            >
                                <strong>{subcategory.name}</strong>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <form onSubmit={subcategoryId ? updateSubCategory : addSubCategory}>
                <label htmlFor="subCategoryName">Sub-Category Name:</label>
                <input
                    type="text"
                    id="subCategoryName"
                    name="subCategoryName"
                    placeholder="Enter Sub-Category Name"
                    value={name}
                    onChange={(e) => {
                        clearMessageOnInteraction();
                        setName(e.target.value);
                    }}
                    required
                /><br /><br />

                <button type="submit">{subcategoryId ? 'UPDATE' : 'ADD'}</button>
                {subcategoryId && <button type="button" onClick={handleDeleteClick}>DELETE</button>}
                {name && <button type="button" onClick={resetForm}>CLEAR</button>}
            </form>

            {showConfirmation && (
                <div className="confirmationPopup">
                    <p>Are you sure you want to delete this subcategory? This action cannot be undone.</p>
                    <button onClick={deleteSubCategory}>Yes, Delete</button>
                    <button onClick={handleCancelDelete}>Cancel</button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default ManageSubCategory;


