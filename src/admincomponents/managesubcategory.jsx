import React, { useState } from "react";
import axios from 'axios';


/**
 * ManageSubCategory component
 * 
 * This component is responsible for performing CRUD operations on subcategories
 * 
 * Props:
 * - closePopup: Function to handle closing the popup
 */
const searchSubCategory = async (query, setSearchResults) => {
    try {
        // Send a GET request to the backend search API with the query parameter
        const response = await axios.get(`http://localhost:3000/api/subcategories/search?q=${query}`);
        console.log(response.data); // Log the response data to verify its structure
        // Update the state with the search results
        setSearchResults(response.data);
    } catch (error) {
        // Log any errors that occur during the API call
        console.error('There was an error searching subcategories!', error);
    }
};

const ManageSubCategory = ({ closePopup }) => {
    // State variables to manage form inputs and search results
    const [subcategoryId, setSubcategoryId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    /**
     * Handles the form submission to add a new subcategory
     * 
     * @param {Event} event - The form submission event
     */
    const addSubCategory = async (event) => {
        event.preventDefault();

        if (!description) {
            setMessage('Description is required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/subcategories', { name, description });
            setMessage(`Subcategory created successfully with ID: ${response.data.id}`);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('There was an error creating the subcategory!', error);
            if (error.response && error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Error creating subcategory');
            }
        }
    };

    /**
     * Handles the form submission to update an existing subcategory
     * 
     * @param {Event} event - The form submission event
     */
    const updateSubCategory = async (event) => {
        event.preventDefault();

        if (!description) {
            setMessage('Description is required.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/subcategories/${subcategoryId}`, { name, description });
            setMessage(`Subcategory updated successfully from "${name}" to "${description}"`);
            setName('');
            setDescription('');
            setSubcategoryId(null);
        } catch (error) {
            console.error('There was an error updating the subcategory!', error);
            if (error.response && error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Error updating subcategory');
            }
        }
    };

    /**
     * Handles selecting a subcategory from the search results
     * 
     * @param {Object} subcategory - The selected subcategory object
     */
    const selectSubCategory = (subcategory) => {
        setSubcategoryId(subcategory.subcategory_id);
        setName(subcategory.name);
        setDescription(subcategory.description);
        setSearchResults([]);
        setSearchQuery('');
    };

    /**
     * Handles deleting a subcategory
     */
    const deleteSubCategory = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/subcategories/${subcategoryId}`);
            setMessage('Subcategory deleted successfully');
            setName('');
            setDescription('');
            setSubcategoryId(null);
            setShowConfirmation(false);
        } catch (error) {
            console.error('There was an error deleting the subcategory!', error);
            setMessage('Error deleting subcategory');
        }
    };

    /**
     * Handles showing the delete confirmation popup
     */
    const handleDeleteClick = () => {
        setShowConfirmation(true);
    };

    /**
     * Handles canceling the delete action
     */
    const handleCancelDelete = () => {
        setShowConfirmation(false);
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
                        setSearchQuery(e.target.value);
                        searchSubCategory(e.target.value, setSearchResults);
                    }}
                />
                <button
                    type="button"
                    id="searchSubCategoryBtn"
                    className="searchButton"
                    onClick={() => searchSubCategory(searchQuery, setSearchResults)}
                >
                    Search
                </button>

                {searchResults.length > 0 && (
                    <ul className="searchResults">
                        {searchResults.map((subcategory) => (
                            <li
                                key={subcategory.subcategory_id}
                                onClick={() => selectSubCategory(subcategory)}
                                className="searchResultItem"
                            >
                                <strong>{subcategory.name}</strong> - {subcategory.description}
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
                    onChange={(e) => setName(e.target.value)}
                    required
                /><br /><br />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea><br /><br />

                <button type="submit">{subcategoryId ? 'UPDATE' : 'ADD'}</button>
                {subcategoryId && <button type="button" onClick={handleDeleteClick}>DELETE</button>}
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
