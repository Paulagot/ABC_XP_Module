import React from 'react';

const PublishStatus = ({ isPublished, handlePublishChange }) => {
  return (
    <div className="publishStatus">
      <label htmlFor="publishMissions">Publish Mission</label>
      <input
        type="checkbox"
        id="publishMissions"
        checked={isPublished}
        onChange={handlePublishChange}
      />
    </div>
  );
};

export default PublishStatus;
