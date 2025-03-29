import React from 'react';

const StatCard = ({ 
  title, 
  icon, 
  value, 
  description, 
  levels, 
  onClick 
}) => (
  <div className="learning-streak-card clickable" onClick={onClick}>
    <div className="card-header">
      <h2 className="rank-title">{title}</h2>
      <span className="achievement-icon">{icon}</span>
    </div>
    <div className="streak-content">
      <div className="streak-number">{value}</div>
      <div className="streak-description">{description}</div>
    </div>
    {levels && (
      <div className="achievement-levels">
        {levels.map((level, index) => (
          <span
            key={index}
            className={`level-indicator ${level.achieved ? 'achieved' : 'pending'}`}
          />
        ))}
      </div>
    )}
  </div>
);

const UserStatsCard = ({ userStats, onAchievementSelect }) => {
  const getAchievement = (name) => 
    userStats.achievements.find(achievement => achievement.name === name);

  const handleCardClick = (achievementName, currentValue, additionalData = null) => {
    if (achievementName) {
      console.log('Clicking card:', { achievementName, currentValue, additionalData });
      onAchievementSelect(achievementName, currentValue, additionalData);
    }
  };

  const globalRankAchievement = getAchievement("Global Rank");
  const learningStreakAchievement = getAchievement("Learning Streak");
  const categoryExplorerAchievement = getAchievement("Category Explorer");
  const missionCompleterAchievement = getAchievement("Mission Completer");

  return (
    <div className="user-stats-grid">
      {/* Global Rank Card */}
      <StatCard
        title="Global Rank"
        icon="🏆"
        value={userStats.leaderboardRank || 'N/A'}
        description="Overall Position"
        levels={globalRankAchievement?.levels}
        onClick={() => handleCardClick(
          "Global Rank",
          userStats.leaderboardPoints,
          {
            learningPoints: userStats.learningPoints,
            experiencePoints: userStats.experiencePoints,
            totalPoints: userStats.leaderboardPoints
          }
        )}
      />

      {/* Learning Streak Card */}
      <StatCard
        title="Learning Streak"
        icon="🔥"
        value={userStats.learningStreak}
        description="Consecutive Days"
        levels={learningStreakAchievement?.levels}
        onClick={() => handleCardClick(
          "Learning Streak",
          userStats.learningStreak
        )}
      />

      {/* Category Explorer Card */}
      <StatCard
        title="Category Explorer"
        icon="🗺️"
        value={userStats.completedCategories || 0}
        description="Categories Explored"
        levels={categoryExplorerAchievement?.levels}
        onClick={() => handleCardClick(
          "Category Explorer",
          userStats.completedCategories
        )}
      />

      {/* Mission Completer Card */}
      <StatCard
        title="Mission Completer"
        icon="🎯"
        value={userStats.completedMissions || 0}
        description="Missions Completed"
        levels={missionCompleterAchievement?.levels}
        onClick={() => handleCardClick(
          "Mission Completer",
          userStats.completedMissions
        )}
      />
    </div>
  );
};

export default UserStatsCard;