// src/components/AchievementItem.jsx
import React from 'react';

const AchievementItem = ({ achievement }) => {
  return (
    <div className="achievement-item">
      <div className="achievement-icon">{achievement.icon}</div>
      <p className="achievement-name">{achievement.name}</p>
      <div className="achievement-levels">
        {achievement.levels.map((level, levelIndex) => (
          <span
            key={levelIndex}
            className={`level-indicator ${level.achieved ? 'achieved' : 'pending'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementItem;