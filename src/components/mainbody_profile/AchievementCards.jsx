// src/components/AchievementsCard.jsx
import React from 'react';
import AchievementItem from './AchievementItem';


const AchievementsCard = ({ achievements }) => {
  return (
    <div className="achievements-card">
      <h2 className="card-title">Achievements</h2>
      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <AchievementItem key={index} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

export default AchievementsCard;