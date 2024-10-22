import React, { useState } from "react";
import axios from 'axios';


const ManageChain = ({ closePopup }) => {

    // State variables to manage form inputs
    const [chain_id, setChainId] = useState(null); // Stores the ID of the selected chain
    const [name, setName] = useState(''); // Stores the name of the chain
    const [chain_image, setChainImage] = useState(''); // Stores the URL of the chain image

    // State variables for search functionality
    const [searchQuery, setSearchQuery] = useState(''); // Stores the current search query
    const [searchResults, setSearchResults] = useState([]); // Stores the search results returned from the API

    // State variables for messaging and confirmations
    const [message, setMessage] = useState(''); // Stores feedback messages for the user
    const [showConfirmation, setShowConfirmation] = useState(false); // Controls the visibility of the delete confirmation popup

    /**
     * searchChain
     * 
     * Sends a GET request to the backend API to search for chains matching the query.
     * 
     * @param {string} query - The search query entered by the user.
     */
    const searchChain = async (query) => {
        try {
            const response = await axios.get(`http://16.171.3.129:3000/api/chains/search?q=${query}`);
            console.log(response.data); // Log response data for debugging purposes
            setSearchResults(response.data); // Update search results state with the data received
        } catch (error) {
            handleError(error, 'Error searching chains');
        }
    };

    /**
     * addChain
     * 
     * Sends a POST request to the backend API to add a new chain with the provided details.
     * 
     * @param {Event} event - The form submission event.
     */
    const addChain = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://16.171.3.129:3000/api/chains', { name, chain_image });
            setMessage(`Chain created successfully with ID: ${response.data.id}`);
            clearForm(); // Reset form fields after successful creation
        } catch (error) {
            handleError(error, 'Error creating chain');
        }
    };

    /**
     * updateChain
     * 
     * Sends a PUT request to the backend API to update the selected chain with new details.
     * 
     * @param {Event} event - The form submission event.
     */
    const updateChain = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await axios.put(`http://16.171.3.129:3000/api/chains/${chain_id}`, { name, chain_image });
            setMessage(`"${name}" updated successfully`);
            clearForm(); // Reset form fields after successful update
        } catch (error) {
            handleError(error, 'Error updating chain');
        }
    };

    /**
     * deleteChain
     * 
     * Sends a DELETE request to the backend API to remove the selected chain.
     */
    const deleteChain = async () => {
        try {
            await retryOperation(() => axios.delete(`http://16.171.3.129:3000/api/chains/${chain_id}`), 3);
            setMessage('Chain deleted successfully');
            clearForm(); // Reset form fields after successful deletion
            setShowConfirmation(false); // Close the confirmation popup
        } catch (error) {
            handleError(error, 'Failed to delete chain after multiple attempts');
        }
    };

    /**
     * selectChain
     * 
     * Populates the form fields with data from the selected chain.
     * 
     * @param {Object} chain - The selected chain object from search results.
     */
    const selectChain = (chain) => {
        setChainId(chain.chain_id);
        setName(chain.name);
        setChainImage(chain.chain_image);
        setSearchResults([]); // Clear search results after selection
        setSearchQuery(''); // Reset search query
    };

    /**
     * clearForm
     * 
     * Resets all form fields and related state variables to their initial empty states.
     * Does not clear the message state immediately to ensure user feedback is visible.
     */
    const clearForm = () => {
        setChainId(null);
        setName('');
        setChainImage('');
        setSearchQuery('');
        setSearchResults([]);
        // Do not clear the message here; give it time to be displayed
        setShowConfirmation(false);
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
     * validateForm
     * 
     * Validates the form inputs to ensure all required fields are filled out correctly.
     * Provides feedback to the user if validation fails.
     * 
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    const validateForm = () => {
        if (!name.trim()) {
            setMessage('Chain name cannot be empty.');
            return false;
        }
        try {
            new URL(chain_image);
        } catch (_) {
            setMessage('Please enter a valid image URL.');
            return false;
        }
        return true;
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
        if (error.response) {
            switch (error.response.data.error) {
                case 'CHAIN_IN_USE':
                    setMessage('This chain is currently in use on a mission and cannot be deleted.');
                    break;
                case 'CHAIN_NOT_FOUND':
                    setMessage('The selected chain does not exist.');
                    break;
                case 'INVALID_IMAGE_URL':
                    setMessage('The image URL provided is invalid. Please check and try again.');
                    break;
                default:
                    setMessage(error.response.data.message || defaultMessage);
            }
        } else {
            console.error(defaultMessage, error);
            setMessage('Network error. Please check your connection and try again.');
        }
    };

    /**
     * retryOperation
     * 
     * Attempts to perform an operation multiple times in case of failure, with a delay between retries.
     * Implements an exponential backoff strategy to prevent overwhelming the server.
     * 
     * @param {Function} operation - The asynchronous operation to perform.
     * @param {number} retries - The number of times to retry the operation upon failure.
     * @returns {Promise} - The result of the operation if successful, or throws an error if all retries fail.
     */
    const retryOperation = async (operation, retries) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === retries - 1 || !error.response) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000)); // Exponential backoff
            }
        }
    };

    return (
        <div id="manageChain" className="manageChainPopup">
            <span id="closeManageChainPopupBtn" className="closeButton" onClick={closePopup}>×</span>
            <h2>Manage Chains</h2>

            <div className="searchContainer">
                <input
                    type="text"
                    id="searchBar"
                    placeholder="Search by chain..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchChain(e.target.value);
                    }}
                />
                <button
                    type="button"
                    id="searchChainBtn"
                    className="searchButton"
                    onClick={() => searchChain(searchQuery)}
                >
                    Search
                </button>

                {searchResults.length > 0 && (
                    <ul className="searchResults">
                        {searchResults.map((chain) => (
                            <li
                                key={chain.chain_id}
                                onClick={() => selectChain(chain)}
                                className="searchResultItem"
                            >
                                <strong>{chain.name}</strong> - {chain.chain_image}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <form onSubmit={chain_id ? updateChain : addChain}>
                <label htmlFor="chainName">Chain Name:</label>
                <input
                    type="text"
                    id="chainName"
                    name="chainName"
                    placeholder="Enter Chain Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                /><br /><br />

                <label htmlFor="chainImage">Chain Image:</label>
                <input
                    type="url"
                    id="chainImage"
                    name="chainImage"
                    placeholder="Enter URL for chain image"
                    value={chain_image}
                    onChange={(e) => setChainImage(e.target.value)}
                    required
                /><br /><br />

                <button type="submit">{chain_id ? 'UPDATE' : 'ADD'}</button>
                {chain_id && (
                    <>
                        <button type="button" onClick={handleDeleteClick}>DELETE</button>
                        <button type="button" onClick={clearForm}>CLEAR</button>
                    </>
                )}
                {!chain_id && (
                    <button type="button" onClick={clearForm}>CLEAR</button>
                )}
            </form>

            {showConfirmation && (
                <div className="confirmationPopup">
                    <p>Are you sure you want to delete this chain? This action cannot be undone.</p>
                    <button onClick={deleteChain}>Yes, Delete</button>
                    <button onClick={handleCancelDelete}>Cancel</button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default ManageChain;