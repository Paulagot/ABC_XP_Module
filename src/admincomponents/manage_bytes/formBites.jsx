import React, { useEffect } from 'react';

/**
 * BiteForm Component
 * 
 * This component renders the form for updating bite data.
 * 
 * Props:
 * - biteData: Object containing the current bite data
 * - setBiteData: Function to update the bite data state
 * - onUpdate: Function to handle the form submission for updating bite data
 * - categories: Array of categories for the dropdown
 * - subcategories: Array of subcategories for the dropdown
 * - sponsors: Array of sponsors for the dropdown
 * - message: Message to display feedback to the user
 * - setMessage: Function to update or clear the success message
 * - onClearForm: Function to clear the form and keep the search view as is
 */
const BiteForm = ({ biteData, setBiteData, onUpdate, categories, subcategories, sponsors, message, setMessage }) => {

  // Initial state for clearing form data
  const initialBiteData = {
    name: '',
    subtitle: '',
    points: '',
    category_id: '',
    subcategory_id: '',
    thumbnail: '',
    url: '',
    sponsor_id: '',
    published: false,
  };

  /**
   * Handle input change for form fields
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBiteData({ ...biteData, [name]: value });
  };

  /**
   * Clear success message after a delay
   */
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000); // Clear after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [message, setMessage]);

  /**
   * Function to clear all form data to initial values
   */
  const onClearForm = () => {
    setBiteData(initialBiteData); // Reset form fields
  };

  return (
    <form onSubmit={onUpdate}>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" value={biteData.name} readOnly /><br /><br />

      <label htmlFor="subtitle">Subtitle:</label>
      <input type="text" id="subtitle" name="subtitle" value={biteData.subtitle} readOnly /><br /><br />

      <label htmlFor="points">Points:</label>
      <input type="number" id="points" name="points" value={biteData.points} onChange={handleChange} required /><br /><br />

      <label htmlFor="category_id">Category:</label>
      <select id="category_id" name="category_id" value={biteData.category_id} onChange={handleChange} required>
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.category_id} value={category.category_id}>{category.name}</option>
        ))}
      </select><br /><br />

      <label htmlFor="subcategory_id">Subcategory:</label>
      <select id="subcategory_id" name="subcategory_id" value={biteData.subcategory_id} onChange={handleChange} required>
        <option value="">Select Subcategory</option>
        {subcategories.map((subcategory) => (
          <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>{subcategory.name}</option>
        ))}
      </select><br /><br />

      <label htmlFor="thumbnail">Thumbnail:</label>
      <input type="text" id="thumbnail" name="thumbnail" value={biteData.thumbnail} readOnly /><br /><br />

      <label htmlFor="url">URL:</label>
      <input type="text" id="url" name="url" value={biteData.url} readOnly /><br /><br />

      <label htmlFor="sponsor_id">Sponsor:</label>
      <select id="sponsor_id" name="sponsor_id" value={biteData.sponsor_id} onChange={handleChange}>
        <option value="">Select Sponsor</option>
        {sponsors.map((sponsor) => (
          <option key={sponsor.sponsor_id} value={sponsor.sponsor_id}>{sponsor.name}</option>
        ))}
      </select><br /><br />

      <div className="publish-bites__status">
        <label htmlFor="publishBite" className="form__label">Publish Bite</label>
        <input type="checkbox" id="publishBite" name="published" checked={biteData.published} onChange={(e) => setBiteData({ ...biteData, published: e.target.checked })} />
      </div><br />

      <input type="submit" value="Update" />
      
      {message && <p>{message}</p>}

      {/* Clear Entire Form button that resets to initial state */}
      <button className="clear" type="button" onClick={onClearForm}>Clear Entire Form</button>
    </form>
  );
};

export default BiteForm;


