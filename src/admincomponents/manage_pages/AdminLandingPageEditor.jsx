// AdminLandingPageEditor.js
import React, { useState } from 'react';
import TypeSelector from './type_selector';
import Header from './header';
import NameSearch from './nameSearch'
import ContentForm from './content_form';
import SEOForm from './seo_form';
import axios from 'axios';
import './header.css'; // Import CSS for styling the header


function AdminLandingPageEditor({ closePopup }) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  const [contentData, setContentData] = useState({
    rich_text_content: '', // New field for TinyMCE editor
    summary: '',           // Keep the summary field as-is
   
  });
  
  const [seoData, setSeoData] = useState({
    seo_title: '',
    meta_description: '',
    meta_keywords: '',
    social_title: '',
    social_description: '',
    social_image: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSelectedName(null);
    setContentData({
      rich_text_content: '', // Reset rich text content
      summary: '',           // Reset summary
   
    });
    setSeoData({
      seo_title: '',
      meta_description: '',
      meta_keywords: '',
      social_title: '',
      social_description: '',
      social_image: '',
    });
    setError(null);
    setSuccessMessage('');
  };
  

  const handleNameSelect = async (name) => {
    setSelectedName(name);
    setError(null);
    setSuccessMessage('');
  
    try {
      const response = await axios.get(`${API_BASE_URL}/api/page-content/draft/${selectedType}/${name.id}`);
      const { data } = response;
  
      // Map backend data to new `contentData` structure
      setContentData({
        rich_text_content: data.rich_text_content || '', // Load rich text content
        summary: data.summary || '',
       
      });
  
      setSeoData({
        seo_title: data.seo_title || '',
        meta_description: data.meta_description || '',
        meta_keywords: data.meta_keywords || '',
        social_title: data.social_title || '',
        social_description: data.social_description || '',
        social_image: data.social_image || '',
      });
  
      // Save `content_id` for future PUT requests
      setSelectedName((prev) => ({
        ...prev,
        content_id: data.content_id,
      }));
  
  
    } catch (error) {
      console.error('Error loading draft:', error);
      setError('No draft found or failed to load draft.');
    }
  };
  
// function to save draft

  const saveDraft = async () => {
    setError(null); // Clear any existing errors
    setSuccessMessage(''); // Clear previous success messages
  
    try {
      const draftData = {
        reference_id: selectedName?.id, // Matches `reference_id` in DB
        reference_type: selectedType,  // Matches `reference_type` in DB
        ...contentData,                // Includes rich_text_content, summary, and tags
        ...seoData,                    // Includes SEO fields
      };
  
   
  
      const response = await axios.post(`${API_BASE_URL}/api/page-content/draft`, draftData, {
        headers: { 'Content-Type': 'application/json' },
      });
  
     
  
      // Reset form state after saving successfully
      setContentData({
        rich_text_content: '', // Clear WYSIWYG content
        summary: '',           // Clear summary
        
      });
      setSeoData({
        seo_title: '',          // Clear SEO fields
        meta_description: '',
        meta_keywords: '',
        social_title: '',
        social_description: '',
        social_image: '',
      });
  
      setSelectedType('');  // Reset the selected type
      setSelectedName(null); // Reset the selected name
      setSuccessMessage(`Draft saved successfully!`);
    } catch (error) {
      console.error('Error saving draft:', error.response?.data || error.message);
      setError('Failed to save draft. Please try again.');
    }
  };
  
  
// function to update/save existing draft
const updateDraft = async () => {
  setError(null); // Clear any errors
  setSuccessMessage(''); // Clear success messages

  try {
    const updatedData = {
      ...contentData, // Includes rich_text_content, summary, and tags
      ...seoData,     // Includes SEO fields
    };

   ;

    const response = await axios.put(`${API_BASE_URL}/api/page-content/${selectedName.content_id}`, updatedData, {
      headers: { 'Content-Type': 'application/json' },
    });

   

    // Reset form state after updating successfully
    setContentData({
      rich_text_content: '', // Clear WYSIWYG content
      summary: '',           // Clear summary
      
    });
    setSeoData({
      seo_title: '',          // Clear SEO fields
      meta_description: '',
      meta_keywords: '',
      social_title: '',
      social_description: '',
      social_image: '',
    });

    setSelectedType('');  // Reset the selected type
    setSelectedName(null); // Reset the selected name
    setSuccessMessage(`Draft updated successfully!`);
  } catch (error) {
    console.error('Error updating draft:', error.response?.data || error.message);
    setError('Failed to update draft. Please try again.');
  }
};

 // Compute whether the Publish button should be enabled
 const isPublishEnabled = Boolean(
  selectedType &&
  selectedName?.content_id &&
  contentData.rich_text_content.trim() !== '' && // Check if rich_text_content is not empty
  Object.values(seoData).every((value) => value.trim() !== '') // All SEO fields are filled
);


const publishPage = async () => {
  // Step 1: Clear any previous errors or success messages
  setError(null);
  setSuccessMessage('');

  // Step 2: Validate that all required fields are filled
  const allFields = { ...contentData, ...seoData };
  const missingFields = Object.entries(allFields).filter(([key, value]) => !value || value.trim() === '');
  
  if (missingFields.length > 0) {
    console.log('Missing fields detected:', missingFields.map(([key]) => key));
    setError('All fields must be filled before publishing.');
    return;
  }

  if (!window.confirm('Are you sure you want to publish this page?')) {
    return;
  }

  try {
    // Step 4: Prepare the data for the PUT request
    const publishData = {
      ...contentData,                // Includes rich_text_content, summary, and tags
      ...seoData,                    // Includes SEO fields
      reference_id: selectedName.id, // Add reference details
      reference_type: selectedType,
    };

       // Debug log 2: Check publish data
       console.log('Publishing data:', publishData);

    // Step 5: Send the PUT request to publish the page
    const response = await axios.put(
      `${API_BASE_URL}/api/page-content/publish/${selectedName.content_id}`,
      publishData,
      { headers: { 'Content-Type': 'application/json' } }
    );

     // Debug log 3: Check response
     console.log('Publish response:', response.data);

    // Step 6: Show success message with the published URL
    setSuccessMessage(`Page published successfully! URL: ${response.data.landing_page_url}`);
    

    // Step 7: Reset the form fields after publishing
    setSelectedType('');
    setSelectedName(null);
    setContentData({
      rich_text_content: '', // Reset rich text content
      summary: '',           // Reset summary
    
      
    });
    setSeoData({
      seo_title: '',          // Reset SEO fields
      meta_description: '',
      meta_keywords: '',
      social_title: '',
      social_description: '',
      social_image: '',
    });
  } catch (error) {
    // Step 8: Handle any errors during the publish process
    console.error('Publish error details:', {
      response: error.response?.data,
      status: error.response?.status,
      message: error.message
    })
    setError('Failed to publish the page. Please try again.');
  }
};





  return (
    <div className="admin-landing-page-editor">
        {/* Close Button */}
    <span 
      className="closeButton" 
      onClick={closePopup} 
      title="Close editor"
    >
      ×
    </span>
   <Header
        onSaveDraft={selectedName?.content_id ? updateDraft : saveDraft}
        onPreview={() => console.log('Preview shown:', contentData, seoData)}
        onPublish={publishPage}
        isPublishEnabled={isPublishEnabled}
      />

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="editor-section">
        <TypeSelector onTypeChange={handleTypeChange} selectedType={selectedType} />
        {selectedType && <NameSearch selectedType={selectedType} onSelectName={handleNameSelect} />}
        {selectedName && (
          <>
            <ContentForm
              contentData={contentData}
              onContentChange={(field, value) => setContentData((prev) => ({ ...prev, [field]: value }))}
            />
            <SEOForm
              seoData={seoData}
              onSeoDataChange={(field, value) => setSeoData((prev) => ({ ...prev, [field]: value }))}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminLandingPageEditor;
