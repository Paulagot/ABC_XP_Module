// Header.js
import React from 'react';
import PropTypes from 'prop-types';
import './header.css'; // Import CSS for styling the header

/**
 * Header component for managing landing page actions.
 * @param {function} onSaveDraft - Function to call when "Save as Draft" is clicked.
 * @param {function} onPreview - Function to call when "Preview" is clicked.
 * @param {function} onPublish - Function to call when "Publish" is clicked.
 * @param {boolean} isPublishEnabled - Determines if the "Publish" button should be enabled.
 */
function Header({ onSaveDraft, onPreview, onPublish, isPublishEnabled }) {
  return (
    <header className="header-container">
      {/* Save as Draft Button */}
      <button
        className="header-button draft-button"
        onClick={onSaveDraft}
        title="Save your current progress as a draft without publishing"
      >
        Save as Draft
      </button>

      {/* Preview Button */}
      <button
        className="header-button preview-button"
        onClick={onPreview}
        title="Preview the landing page with the current content"
      >
        Preview
      </button>

      {/* Publish Button */}
      <button
        className="header-button publish-button"
        onClick={onPublish}
        disabled={!isPublishEnabled} // Disable if required fields are missing
        title="Publish the landing page (ensure all required fields are filled)"
      >
        Publish
      </button>
    </header>
  );
}

// PropTypes to ensure correct prop usage
Header.propTypes = {
  onSaveDraft: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  isPublishEnabled: PropTypes.bool.isRequired,
};

export default Header;
