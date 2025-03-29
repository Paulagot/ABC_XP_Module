import React, { useState, useEffect } from 'react';
import './header.css';

/**
 * SEOForm component for managing SEO-related fields and meta information.
 * @param {object} seoData - The current state of SEO fields.
 * @param {function} onSeoDataChange - Callback to update SEO data in the parent component.
 */
function SEOForm({ seoData, onSeoDataChange }) {
    const handleChange = (field, value) => {
      console.log(`Updating ${field} to ${value}`); // Debugging
      onSeoDataChange(field, value);
    };
  
    return (
      <div className="seo-form">
        <h2>SEO Settings</h2>
          <div className='meta'>
        <label>
          SEO Title:
          <input
            type="text"
            value={seoData.seo_title}
            onChange={(e) => handleChange('seo_title', e.target.value)}
          />
        </label>
  
        <label>
          Meta Description:
          <textarea
            value={seoData.meta_description}
            onChange={(e) => handleChange('meta_description', e.target.value)}
          />
        </label>
  
        <label>
          Meta Keywords:
          <input
            type="text"
            value={seoData.meta_keywords}
            onChange={(e) => handleChange('meta_keywords', e.target.value)}
          />
        </label>
        </div>
        <div className='social'>
        <label>
          Social Title:
          <input
            type="text"
            value={seoData.social_title}
            onChange={(e) => handleChange('social_title', e.target.value)}
          />
        </label>
  
        <label>
          Social Description:
          <textarea
            value={seoData.social_description}
            onChange={(e) => handleChange('social_description', e.target.value)}
          />
        </label>
  
        <label>
          Social Image URL:
          <input
            type="text"
            value={seoData.social_image}
            onChange={(e) => handleChange('social_image', e.target.value)}
          />
        </label>
         </div>
      </div>
    );
  }
  
  

export default SEOForm;
