import React, { useState } from "react";
import axios from 'axios';


/**
 * Manage Partner component
 * 
 * This component is responsible for rendering the popup for managing Partner/sponsors.
 * 
 * Props:
 * - closePopup: Function to handle closing the popup.
 */

const ManagePartner = ({ closePopup }) => {

    // State variables to manage form inputs and search results
    const [sponsorId, setSponsorId] = useState(null); // Stores the ID of the selected sponsor
    const [name, setName] = useState(''); // Stores the name of the sponsor
    const [sponsor_image, setSponsorImage] = useState(''); // Stores the URL of the sponsor image
    const [website, setWebsite] = useState(''); // Stores the URL of the sponsor's website

    const [searchQuery, setSearchQuery] = useState(''); // Stores the current search query
    const [searchResults, setSearchResults] = useState([]); // Stores the search results returned from the API
    const [message, setMessage] = useState(''); // Stores feedback messages for the user
    const [showConfirmation, setShowConfirmation] = useState(false); // Controls the visibility of the delete confirmation popup

    /**
     * searchSponsor
     * 
     * Sends a GET request to the backend API to search for sponsors based on the query.
     * 
     * @param {string} query - The search query entered by the user.
     */
    const searchSponsor = async (query) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/sponsors/search?q=${query}`);
            console.log(response.data); // Log the response data for debugging purposes
            setSearchResults(response.data); // Update search results state with the data received
        } catch (error) {
            console.error('There was an error searching partners!', error);
            setMessage('Error searching partners');
        }
    };

    /**
     * addSponsor
     * 
     * Sends a POST request to the backend API to add a new partner with the provided details.
     * 
     * @param {Event} event - The form submission event.
     */
    const addSponsor = async (event) => {
        event.preventDefault();

        if (!sponsor_image) {
            setMessage('Partner image URL is required.');
            return;
        }

        if (!website) {
            setMessage('Partner website is required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/sponsors', { name, sponsor_image, website });
            setMessage(`Partner created successfully with ID: ${response.data.id}`);
            resetForm(); // Reset form fields after successful creation
        } catch (error) {
            console.error('There was an error creating the partner!', error);
            handleError(error, 'Error creating partner');
        }
    };

    /**
     * updateSponsor
     * 
     * Sends a PUT request to the backend API to update an existing sponsor.
     * 
     * @param {Event} event - The form submission event.
     */
    const updateSponsor = async (event) => {
        event.preventDefault();

        if (!sponsor_image) {
            setMessage('Partner image URL is required.');
            return;
        }

        if (!website) {
            setMessage('Partner website is required.');
            return;
        }

        try {
            await axios.put(`http://localhost:3000/api/sponsors/${sponsorId}`, { name, sponsor_image, website });
            setMessage(`Partner "${name}" updated successfully.`);
            resetForm(); // Reset form fields after successful update
        } catch (error) {
            console.error('There was an error updating the partner!', error);
            handleError(error, 'Error updating partner');
        }
    };

    /**
     * deleteSponsor
     * 
     * Sends a DELETE request to the backend API to remove the selected sponsor.
     */
    const deleteSponsor = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/sponsors/${sponsorId}`);
            setMessage('Partner deleted successfully');
            resetForm(); // Reset form fields after successful deletion
            setShowConfirmation(false); // Close the confirmation popup
        } catch (error) {
            console.error('There was an error deleting the partner!', error);
            setMessage('Error deleting partner');
        }
    };

    /**
     * selectSponsor
     * 
     * Populates the form fields with data from the selected sponsor.
     * 
     * @param {Object} sponsor - The selected sponsor object.
     */
    const selectSponsor = (sponsor) => {
        clearMessageOnInteraction(); // Ensure the message is cleared when a new sponsor is selected
        setSponsorId(sponsor.sponsor_id);
        setName(sponsor.name);
        setSponsorImage(sponsor.sponsor_image);
        setWebsite(sponsor.website);
        setSearchResults([]);
        setSearchQuery('');
    };

    /**
     * resetForm
     * 
     * Resets all form fields and related state variables to their initial empty states.
     */
    const resetForm = () => {
        setSponsorId(null);
        setName('');
        setSponsorImage('');
        setWebsite('');
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
     * @param {Object} error - The error object received from theAPI or the catch block. * 
     * @param {string} defaultMessage - The default message to display if the error is not recognized. 
     * */ 
    
    const handleError = (error, defaultMessage) => { 
        if (error.response && error.response.data && error.response.data.error) 
            { setMessage(error.response.data.error); } else { setMessage(defaultMessage); } };

   /**
 * clearMessageOnInteraction
 * 
 * Clears the message state when the user interacts with the form or performs a search.
 */
const clearMessageOnInteraction = () => {
    setMessage('');
};

return (
    <div id="managePartner" className="managePartnerPopup">
        <span id="closeManagePartnerPopupBtn" className="closeButton" onClick={closePopup}>×</span>
        <h2>Manage Partners</h2>

        <div className="searchContainer">
            <input 
                type="text" 
                id="searchBar" 
                placeholder="Search by partner..."
                value={searchQuery}
                onChange={(e) => {
                    clearMessageOnInteraction();
                    setSearchQuery(e.target.value);
                    searchSponsor(e.target.value);
                }} 
            />
            <button 
                type="button" 
                id="searchPartnerBtn" 
                className="searchButton" 
                onClick={() => {
                    clearMessageOnInteraction();
                    searchSponsor(searchQuery);
                }}
            >
                Search
            </button>

            {searchResults.length > 0 && (
                <ul className="searchResults">
                    {searchResults.map((sponsor) => (
                        <li
                            key={sponsor.sponsor_id}
                            onClick={() => {
                                clearMessageOnInteraction();
                                selectSponsor(sponsor);
                            }}
                            className="searchResultItem"
                        >
                            <strong>{sponsor.name}</strong> - {sponsor.website}
                        </li>
                    ))}
                </ul>
            )}    
        </div>

        <form className="adminForm" onSubmit={sponsorId ? updateSponsor : addSponsor}>
            <label htmlFor="partnerName">Partner Name:</label>
            <input 
                type="text" 
                id="partnerName" 
                name="partnerName" 
                placeholder="Enter Partner Name"
                value={name}
                onChange={(e) => {
                    clearMessageOnInteraction();
                    setName(e.target.value);
                }} 
                required 
            /><br /><br />

            <label htmlFor="sponsorImage">Partner Image:</label>
            <input 
                type="url" 
                id="sponsorImage" 
                name="sponsorImage" 
                placeholder="Enter URL for partner's image"
                value={sponsor_image}
                onChange={(e) => {
                    clearMessageOnInteraction();
                    setSponsorImage(e.target.value);
                }} 
                required 
            /><br /><br />
            
            <label htmlFor="sponsorWebsite">Partner Website:</label>
            <input 
                type="url" 
                id="sponsorWebsite" 
                name="sponsorWebsite" 
                placeholder="Enter link" 
                value={website}
                onChange={(e) => {
                    clearMessageOnInteraction();
                    setWebsite(e.target.value);
                }} 
                required 
            /><br /><br />
        
            <button type="submit">{sponsorId ? 'UPDATE' : 'ADD'}</button>
            {sponsorId && <button type="button" onClick={handleDeleteClick}>DELETE</button>}
            {(name || sponsor_image || website) && <button type="button" onClick={resetForm}>CLEAR</button>}
        </form>

        {showConfirmation && (
            <div className="confirmationPopup">
                <p>Are you sure you want to delete this partner? This action cannot be undone.</p>
                <button onClick={deleteSponsor}>Yes, Delete</button>
                <button onClick={handleCancelDelete}>Cancel</button>
            </div>
        )}

        {message && <p>{message}</p>}
    </div>
);     

};

export default ManagePartner;
