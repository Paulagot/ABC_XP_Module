// ContentForm.js
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './header.css';

import { Editor } from '@tinymce/tinymce-react'; // Import TinyMCE editor component


function ContentForm({ contentData, onContentChange }) {
  const handleChange = (field, value) => onContentChange(field, value);

  return (
    <div className="content-form">
      <h3>Rich Text Content</h3>

      {/* TinyMCE Editor */}
      <label className='content'>
        Content:
        <Editor className="editor"
          apiKey="zkdrrge6bgcu7ozl917c0wvcxnpty1de5xdayip7yw7rr6sc" // Replace with your actual API key
          value={contentData.rich_text_content || ''}
          init={{
            height: 400,
            width: 1000,
            menubar: true, // Adds the menu bar at the top
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: `undo redo | formatselect | bold italic backcolor | 
        alignleft aligncenter alignright alignjustify | 
        bullist numlist outdent indent | removeformat | help`,
content_style: 'body { font-family:Poppins,sans-serif; font-size:14px }',
          }}
          onEditorChange={(content) => handleChange('rich_text_content', content)} // Update parent state with new content
        />
      </label>

      {/* Summary Field */}
      <div className='summaryfields'>
      <label>
        Summary:
        <textarea
          value={contentData.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
        />
      </label>

    
      </div>
    </div>
  );
}

ContentForm.propTypes = {
  contentData: PropTypes.shape({
    rich_text_content: PropTypes.string,
    summary: PropTypes.string,
    tags: PropTypes.string,
  }).isRequired,
  onContentChange: PropTypes.func.isRequired,
};

export default ContentForm;


