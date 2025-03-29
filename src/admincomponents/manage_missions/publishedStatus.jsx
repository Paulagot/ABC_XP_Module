import React from 'react';

const PublishStatus = ({ isPublished, handlePublishChange, canPublish }) => {
  return (
    <div className="publishStatus">
      <label htmlFor="publishMissions">Publish Mission</label>
      <input
        type="checkbox"
        id="publishMissions"
        checked={isPublished}
        onChange={handlePublishChange}
        disabled={!canPublish} // Disable if the mission does not meet criteria
      />
    </div>
  );
};

export default PublishStatus;

