import React, { useState } from "react";
import axios from 'axios';

/**
 * Manage Partner component
 * 
 * This component is responsible for rendering the popup for managing Partner/sponsors
 * 
 * Props:
 * - closePopup: Function to handle closing the popup
 * 
 */
const searchSponsor = async (query, setSearchResults) => {
  try {
      // Send a GET request to the backend search API with the query parameter
      const response = await axios.get(`http://localhost:3000/api/sponsors/search?q=${query}`);
      console.log(response.data); // Log the response data to verify its structure
      // Update the state with the search results
      setSearchResults(response.data);
  } catch (error) {
      // Log any errors that occur during the API call
      console.error('There was an error searching sponsors!', error);
  }
};

const ManagePartner = ({ closePopup }) => {

 // State variables to manage form inputs and search results
 const [sponsorId, setSponsorId] = useState(null);
 const [name, setName] = useState('');
 const [sponsor_image, setSponsor_Image] = useState('');
 const [website, setWebsite] = useState('');
 const [searchQuery, setSearchQuery] = useState('');
 const [searchResults, setSearchResults] = useState([]);
 const [message, setMessage] = useState('');
 const [showConfirmation, setShowConfirmation] = useState(false);

 /**
     * Handles the form submission to add a new Partner/sponsor
     * 
     * @param {Event} event - The form submission event
     */
 const addSponsor = async (event) => {
  event.preventDefault();

  if (!sponsor_image) {
      setMessage('sponsor image url is required.');
      return;
  }

  if (!website) {
    setMessage('sponsor website is required.');
    return;
}

  try {
      const response = await axios.post('http://localhost:3000/api/sponsors', { name, sponsor_image, website });
      setMessage(`Sponsor created successfully with ID: ${response.data.id}`);
      setName('');
      setSponsor_Image('');
      setWebsite('');

  } catch (error) {
      console.error('There was an error creating the sponsor!', error);
      if (error.response && error.response.data && error.response.data.error) {
          setMessage(error.response.data.error);
      } else {
          setMessage('Error creating sponsor');
      }
  }
};

  /**
     * Handles the form submission to update an existing sponsor
     * 
     * @param {Event} event - The form submission event
     */
  const updateSponsor = async (event) => {
    event.preventDefault();

    if (!sponsor_image) {
      setMessage('sponsor image url is required.');
      return;
  }

  if (!website) {
    setMessage('sponsor website is required.');
    return;
}

    try {
        const response = await axios.put(`http://localhost:3000/api/sponsors/${sponsorId}`, { name, sponsor_image, website });
        setMessage(`Subcategory updated successfully from "${name}" to "${website}"`);
        setName('');
        setSponsor_Image('');
        setWebsite('');
        setSponsorId(null);
    } catch (error) {
        console.error('There was an error updating the sponsor!', error);
        if (error.response && error.response.data && error.response.data.error) {
            setMessage(error.response.data.error);
        } else {
            setMessage('Error updating sponsor');
        }
    }
};

  /**
     * Handles selecting a sponsors from the search results
     * 
     * @param {Object} sponsors - The selected sponsors object
     */
  const selectSponsor = (sponsors) => {
    setSponsorId(sponsors.sponsor_id);
    setName(sponsors.name);
    setSponsor_Image(sponsors.sponsor_image);
    setWebsite(sponsors.website);
    setSearchResults([]);
    setSearchQuery('');
};

  /**
     * Handles deleting a subcategory
     */
  const deleteSponsor = async () => {
    try {
        await axios.delete(`http://localhost:3000/api/sponsors/${sponsorId}`);
        setMessage('Sponsor deleted successfully');
        setName('');
        setSponsor_Image('');
        setWebsite('');
        setSponsorId(null);
        setShowConfirmation(false);
    } catch (error) {
        console.error('There was an error deleting the sponsor!', error);
        setMessage('Error deleting sponsor');
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
        setSearchQuery(e.target.value);
        searchSponsor(e.target.value, setSearchResults);
                    }} 
      />
      <button 
      type="button" 
      id="searchPartnerBtn" 
      className="searchButton" 
      onClick={() => searchSponsor(searchQuery, setSearchResults)}
      
      >Search</button>

      {searchResults.length > 0 && (
                    <ul className="searchResults">
                        {searchResults.map((sponsors) => (
                            <li
                                key={sponsors.sponsor_id}
                                onClick={() => selectSponsor(sponsors)}
                                className="searchResultItem"
                            >
                                <strong>{sponsors.name}</strong> - {sponsors.website}
                            </li>
                        ))}
                    </ul>
                )}    
    </div>
    




    <form onSubmit={sponsorId ? updateSponsor : addSponsor}>
            <label htmlFor="partnerName">Partner Name:</label>
            <input 
            type="text" 
            id="partnerName" 
            name="partnerName" 
            placeholder="Enter Partner Name"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required /><br /><br />

            <label htmlFor="sponsorImage">Sponsor Image:</label>
            <input 
            type="text" 
            id="sponsorImage" 
            name="sponsorImage" 
            placeholder="Enter url for sponsor image"
            value={sponsor_image}
            onChange={(e) => setSponsor_Image(e.target.value)} 
            required /><br /><br />
            
           

            <label htmlFor="sponsorWebsite">Sponsor Website:</label>
            <input 
            type="text" 
            id="sponsorWebsite" 
            name="sponsorWebsite" 
            placeholder="Enter link" 
            value={website}
            onChange={(e) => setWebsite(e.target.value)} 
            required /><br /><br />
        
        <button type="submit">{sponsorId ? 'UPDATE' : 'ADD'}</button>
        {sponsorId && <button type="button" onClick={handleDeleteClick}>DELETE</button>}
            
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