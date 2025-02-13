// CategoryProgressDetails.jsx
import React from 'react';
import ProgressBar from './ProgressBar';

const CategoryProgressDetails = ({ category, missionStats }) => {
  const sortedLevels = [...category.levels].sort((a, b) => {
    const order = { "Essentials": 1, "Intermediate": 2, "Advanced": 3 };
    return (order[a.name] || 99) - (order[b.name] || 99);
  });

  return (
    <div className="category-progress-details">
      <h2 className="category-details-title">{category.name} Details</h2>
      
      <div className="progress-list">
        {sortedLevels.map((level, idx) => (
          <ProgressBar 
            key={idx}
            level={level.name}
            progress={level.progress * 100}
            completedBites={level.completedBites}
            totalBites={level.totalBites}
          />
        ))}
      </div>

      <div className="missions-info">
        <div className="missions-stats-grid">
          <div className="mission-stat">
            <span className="mission-label">Total Missions: </span>
            <span className="mission-value">{missionStats.total_missions}</span>
          </div>
          <div className="mission-stat">
            <span className="mission-label">Missions Unlocked: </span>
            <span className="mission-value">{missionStats.unlocked_missions}</span>
          </div>
          <div className="mission-stat">
            <span className="mission-label">Missions Completed: </span>
            <span className="mission-value">{missionStats.completed_missions}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProgressDetails;

