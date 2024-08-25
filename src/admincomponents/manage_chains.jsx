import React, { useState } from "react";
import axios from 'axios';

/**
 * Manage Chain component
 * 
 * This component is responsible for rendering the popup for managing Chain/chains
 * 
 * Props:
 * - closePopup: Function to handle closing the popup
 * 
 */
const searchChain = async (query, setSearchResults) => {
  try {
      // Send a GET request to the backend search API with the query parameter
      const response = await axios.get(`http://localhost:3000/api/chains/search?q=${query}`);
      console.log(response.data); // Log the response data to verify its structure
      // Update the state with the search results
      setSearchResults(response.data);
  } catch (error) {
      // Log any errors that occur during the API call
      console.error('There was an error searching chains!', error);
  }
};

const ManageChain = ({ closePopup }) => {

 // State variables to manage form inputs and search results
 const [chain_id, setChainId] = useState(null);
 const [name, setName] = useState('');
 const [chain_image, setChain_Image] = useState('');
 const [chain_web, setWebsite] = useState('');
 const [searchQuery, setSearchQuery] = useState('');
 const [searchResults, setSearchResults] = useState([]);
 const [message, setMessage] = useState('');
 const [showConfirmation, setShowConfirmation] = useState(false);

 /**
     * Handles the form submission to add a new Chain/chain
     * 
     * @param {Event} event - The form submission event
     */
 const addChain = async (event) => {
  event.preventDefault();

  if (!chain_image) {
      setMessage('chain image url is required.');
      return;
  }

  if (!chain_web) {
    setMessage('chain website is required.');
    return;
}

  try {
      const response = await axios.post('http://localhost:3000/api/chains', { name, chain_image, chain_web });
      setMessage(`Chain created successfully with ID: ${response.data.id}`);
      setName('');
      setChain_Image('');
      setWebsite('');

  } catch (error) {
      console.error('There was an error creating the chain!', error);
      if (error.response && error.response.data && error.response.data.error) {
          setMessage(error.response.data.error);
      } else {
          setMessage('Error creating chain');
      }
  }
};

  /**
     * Handles the form submission to update an existing chain
     * 
     * @param {Event} event - The form submission event
     */
  const updateChain = async (event) => {
    event.preventDefault();

    if (!chain_image) {
      setMessage('chain image url is required.');
      return;
  }

  if (!chain_web) {
    setMessage('chain website is required.');
    return;
}

    try {
        const response = await axios.put(`http://localhost:3000/api/chains/${chain_id}`, { name, chain_image, chain_web });
        setMessage(`Subcategory updated successfully from "${name}" to "${chain_web}"`);
        setName('');
        setChain_Image('');
        setWebsite('');
        setChainId(null);
    } catch (error) {
        console.error('There was an error updating the chain!', error);
        if (error.response && error.response.data && error.response.data.error) {
            setMessage(error.response.data.error);
        } else {
            setMessage('Error updating chain');
        }
    }
};

  /**
     * Handles selecting a chains from the search results
     * 
     * @param {Object} chains - The selected chains object
     */
  const selectChain = (chains) => {
    setChainId(chains.chain_id);
    setName(chains.name);
    setChain_Image(chains.chain_image);
    setWebsite(chains.chain_web);
    setSearchResults([]);
    setSearchQuery('');
};

  /**
     * Handles deleting a chain
     */
  const deleteChain = async () => {
    try {
        await axios.delete(`http://localhost:3000/api/chains/${chain_id}`);
        setMessage('Chain deleted successfully');
        setName('');
        setChain_Image('');
        setWebsite('');
        setChainId(null);
        setShowConfirmation(false);
    } catch (error) {
        console.error('There was an error deleting the chain!', error);
        setMessage('Error deleting chain');
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
                searchChain(e.target.value, setSearchResults);
                            }} 
            />
            <button 
            type="button" 
            id="searchChainBtn" 
            className="searchButton" 
            onClick={() => searchChain(searchQuery, setSearchResults)}
            
            >Search</button>

            {searchResults.length > 0 && (
                            <ul className="searchResults">
                                {searchResults.map((chains) => (
                                    <li
                                        key={chains.chain_id}
                                        onClick={() => selectChain(chains)}
                                        className="searchResultItem"
                                    >
                                        <strong>{chains.name}</strong> - {chains.chain_web}
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
                    required /><br /><br />

                    <label htmlFor="chainImage">Chain Image:</label>
                    <input 
                    type="text" 
                    id="chainImage" 
                    name="chainImage" 
                    placeholder="Enter url for chain image"
                    value={chain_image}
                    onChange={(e) => setChain_Image(e.target.value)} 
                    required /><br /><br />
                    
                

                    <label htmlFor="chainWebsite">Chain Website:</label>
                    <input 
                    type="text" 
                    id="chainWebsite" 
                    name="chainWebsite" 
                    placeholder="Enter link" 
                    value={chain_web}
                    onChange={(e) => setWebsite(e.target.value)} 
                    required /><br /><br />
                
                <button type="submit">{chain_id ? 'UPDATE' : 'ADD'}</button>
                {chain_id && <button type="button" onClick={handleDeleteClick}>DELETE</button>}
                    
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
