import React from 'react';
import NFTPreviewCard from './NFTPreviewCard';

const getCurrentLevel = (achievement) => {
  if (!achievement.levels?.length) return 'Getting Started';
  
  const highestAchieved = [...achievement.levels]
    .reverse()
    .find(level => level.achieved);
  return highestAchieved ? highestAchieved.name : 'Getting Started';
};

const getNextMilestone = (achievement, currentValue) => {
  if (!achievement.levels?.length) return 'Loading...';
  
  const nextLevel = achievement.levels.find(level => !level.achieved);
  if (!nextLevel) return 'Max Level';
  
  const remaining = nextLevel.threshold - currentValue;
  return `${nextLevel.name} (${remaining.toLocaleString()} points to go)`;
};

const getRequirementText = (achievementName) => {
  const requirements = {
    'Learning Streak': 'consecutive days',
    'Category Explorer': 'categories explored',
    'Mission Completer': 'missions completed',
    'Global Rank': 'total points'
  };
  return requirements[achievementName] || 'achievements';
};

const generateEncouragement = (achievement, currentValue) => {
  if (!achievement.levels?.length) return '';
  
  const nextLevel = achievement.levels.find(level => !level.achieved);
  if (!nextLevel) {
    return "Incredible work! You've reached the highest level of mastery. Keep pushing the boundaries!";
  }

  const remaining = nextLevel.threshold - currentValue;
  
  const messages = {
    'Global Rank': `Amazing progress! Keep earning points to reach ${nextLevel.name}!`,
    'Learning Streak': `Amazing consistency! Just ${remaining} more days to reach ${nextLevel.name}. Your dedication to learning is inspiring!`,
    'Category Explorer': `You're expanding your knowledge! Explore ${remaining} more categories to become a ${nextLevel.name}. Each new category brings exciting discoveries!`,
    'Mission Completer': `You're making great progress! Complete ${remaining} more missions to reach ${nextLevel.name} status. Every mission completed is a step toward mastery!`
  };

  return messages[achievement.name] || `Keep going! You're ${remaining} steps away from your next achievement!`;
};

const AchievementProgressDetails = ({ achievement, currentValue, additionalData }) => {
  if (!achievement.levels?.length) {
    return <div>Loading achievement details...</div>;
  }

  const currentLevel = achievement.levels.find(level => !level.achieved) || 
                      achievement.levels[achievement.levels.length - 1];

  const renderPointsBreakdown = () => {
    if (achievement.name === "Global Rank" && additionalData) {
      return (
        <div className="points-breakdown">
          <h3 className="achievement-section-title">Points Breakdown</h3>
          <div className="points-list">
            <div className="points-item">
              <span>Learning Points (LP)</span>
              <span>{additionalData.learningPoints?.toLocaleString()}</span>
            </div>
            <div className="points-item">
              <span>Experience Points (XP)</span>
              <span>{additionalData.experiencePoints?.toLocaleString()}</span>
            </div>
            <div className="points-item total">
              <span>Total Points</span>
              <span>{additionalData.totalPoints?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="category-progress-details">
      <div className="achievement-header">
        <h2 className="category-details-title">
          {achievement.name}
          <span className="achievement-icon-large">{achievement.icon}</span>
        </h2>
      </div>

      <div className="encouragement-section">
        <p className="encouragement-text">
          {generateEncouragement(achievement, currentValue)}
        </p>
      </div>
      
      <div className="achievement-content">
        {renderPointsBreakdown()}

        <div className="levels-section">
          <h3 className="achievement-section-title">Achievement Levels</h3>
          <div className="achievement-levels-list">
            {achievement.levels.map((level, index) => (
              <div 
                key={index}
                className={`level-card ${level.achieved ? 'level-achieved' : 'level-pending'}`}
              >
                <div className="level-content">
                  <div className="level-info">
                    <h4 className="level-name">{level.name}</h4>
                    <p className="level-requirement">
                      Requires: {level.threshold.toLocaleString()} {getRequirementText(achievement.name)}
                    </p>
                  </div>
                  {level.achieved && (
                    <span className="achievement-check">✓ Achieved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementDetailModal = ({ achievement, currentValue, additionalData, nftPreviewTemplate }) => {
  if (!achievement) return null;

  const updatedNFTTemplate = {
    ...nftPreviewTemplate,
    overlayDetails: [
      { label: "Achievement", value: achievement.name },
      { label: "Current Level", value: getCurrentLevel(achievement) },
      { label: "Progress", value: `${Math.min(100, 
        ((currentValue / (achievement.levels?.find(level => !level.achieved)?.threshold || 1)) * 100).toFixed(0)
      )}%` },
      { label: "Next Milestone", value: getNextMilestone(achievement, currentValue) }
    ]
  };

  return (
    <div className="category-detail-grid">
      <AchievementProgressDetails 
        achievement={achievement}
        currentValue={currentValue || 0}
        additionalData={additionalData}
      />
      <NFTPreviewCard 
        nftPreviewTemplate={updatedNFTTemplate}
        categoryName={achievement.name}
      />
    </div>
  );
};

export default AchievementDetailModal;