import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBites from './searchBites.jsx'
import BiteForm from './formBites.jsx'
import Message from './messageBites.jsx';


/**
 * ManageBites Component
 * 
 * This component manages the bite data including searching and updating.
 * 
 * Props:
 * - closePopup: Function to close the popup
 */
const ManageBites = ({ closePopup }) => {
  const [biteId, setBiteId] = useState(null);
  const [biteData, setBiteData] = useState({
    name: '',
    subtitle: '',
    points: '',
    category_id: '',
    subcategory_id: '',
    thumbnail: '',
    url: '',
    player_url: '',
    sponsor_id: '',
    published: false,
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch categories, subcategories, and sponsors when the component mounts
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('http://localhost:3000/api/categories');
        setCategories(categoriesResponse.data);

        const subcategoriesResponse = await axios.get('http://localhost:3000/api/subcategories');
        setSubcategories(subcategoriesResponse.data);

        const sponsorsResponse = await axios.get('http://localhost:3000/api/sponsors');
        setSponsors(sponsorsResponse.data);
      } catch (error) {
        console.error('Error fetching categories, subcategories, or sponsors', error);
      }
    };

    fetchData();
  }, []);

  /**
   * Handle selection of a bite and populate the form
   */
  const selectBite = (bite) => {
    setBiteId(bite.bite_id);
    setBiteData({
      name: bite.name,
      subtitle: bite.subtitle,
      points: bite.points || '',
      category_id: bite.category_id || '',
      subcategory_id: bite.subcategory_id || '',
      thumbnail: bite.thumbnail,
      url: bite.url,
      player_url: bite.player_url || '',
      sponsor_id: bite.sponsor_id || '',
      published: bite.published || false,
    });
  };

  /**
   * Handle update of bite data
   */
  const updateBite = async (e) => {
    e.preventDefault();

    // Log the data being sent to the backend
    console.log('Updating bite with data:', biteData);

    try {
      const response = await axios.put(`http://localhost:3000/api/bites/${biteId}`, biteData);
      setMessage('Bite updated successfully!');
      setBiteData({
        name: '',
        subtitle: '',
        points: '',
        category_id: '',
        subcategory_id: '',
        thumbnail: '',
        url: '',
        player_url: '',
        sponsor_id: '',
        published: false,
      });
    } catch (error) {
      console.error('There was an error updating the bite!', error);
      setMessage('There was an error updating the bite.');
    }
  };

  return (
    <div id="manageBites" className="manageBitesPopup">
      <span id="closeManageBitesPopupBtn" className="closeButton" onClick={closePopup}>×</span>
      <h2>Manage Bites</h2>
      <SearchBites onSelectBite={selectBite} />
      {biteId && (
        <BiteForm
          biteData={biteData}
          setBiteData={setBiteData}
          onUpdate={updateBite}
          categories={categories}
          subcategories={subcategories}
          sponsors={sponsors}
          message={message}
        />
      )}
      <Message message={message} />
    </div>
  );
};

export default ManageBites;