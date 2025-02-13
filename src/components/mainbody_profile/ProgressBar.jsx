import React from 'react';


const ProgressBar = ({ 
  level, 
  progress, 
  completedBites, 
  totalBites
}) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-level">{level}</span>
        <div className="progress-stats">
          <span className="progress-percentage">
            {progress.toFixed(0)}%
          </span>
          {completedBites !== undefined && totalBites !== undefined && (
            <span className="progress-bites">
              ({completedBites}/{totalBites} bites)
            </span>
          )}
        </div>
      </div>
      
      <div className="progress-track">
        <div 
          className="progress-fill"
          style={{width: `${progress}%`}}
        />
      </div>

     
    </div>
  );
};

export default ProgressBar;