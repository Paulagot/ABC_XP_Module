import React, { useState, useEffect } from 'react';
import UserStatsCard from './userStatCards';
import CategoryList from './CategoryList';
import CategoryDetailModal from './CategoryDetailModal';
import AchievementDetailModal from './AchievementDetailModal';
import axios from 'axios';
import { useAuth } from "../../context/auth_context";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CategoryNFTDashboard = () => {
  const { user, loading } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate(); // Initialize useNavigate

  const [userStats, setUserStats] = useState({
    learningStreak: 0,
    leaderboardRank: null,
    learningPoints: 0,
    experiencePoints: 0,
    leaderboardPoints: 0,
    completedCategories: 0,
    completedMissions: 0,
    achievements: []
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  const nftPreviewTemplate = {
    backgroundColor: "bg-gradient-to-br from-blue-100 to-purple-100",
    borderStyle: "border-4 border-blue-300",
    overlayDetails: [
      { label: "Category", value: "Programming" },
      { label: "Levels Completed", value: "3/4" },
      { label: "Total Progress", value: "85%" },
      { label: "Missions Completed", value: "42/50" }
    ]
  };

  const calculateRankingThresholds = (rankComparisons) => {
    if (!rankComparisons) return {};
    
    return {
      rank1: rankComparisons.rank_1?.total_points || 0,
      rank3: rankComparisons.rank_3?.total_points || 0,
      rank5: rankComparisons.rank_5?.total_points || 0,
      rank10: rankComparisons.rank_10?.total_points || 0,
      rank20: rankComparisons.rank_20?.total_points || 0,
      rank50: rankComparisons.rank_50?.total_points || 0,
      rank100: rankComparisons.rank_100?.total_points || 0
    };
  };

  const fetchLeaderboardRank = async () => {
    if (!user?.user_id) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/lifetime-rank?userId=${user.user_id}`);
      const { userRank, userData, rankComparisons } = response.data;
      
      if (rankComparisons) {
        const thresholds = calculateRankingThresholds(rankComparisons);
        
        if (userRank && userData) {
          setUserStats(prevStats => {
            const achievements = [
              {
                name: "Learning Streak",
                icon: "🔥",
                levels: [
                  { threshold: 1, name: "Spark", achieved: prevStats.learningStreak >= 1 },
                  { threshold: 3, name: "Flame", achieved: prevStats.learningStreak >= 3 },
                  { threshold: 7, name: "Inferno", achieved: prevStats.learningStreak >= 7 }
                ]
              },
              {
                name: "Category Explorer",
                icon: "🗺️",
                levels: [
                  { threshold: 1, name: "Novice", achieved: prevStats.completedCategories >= 1 },
                  { threshold: 3, name: "Pathfinder", achieved: prevStats.completedCategories >= 3 },
                  { threshold: 5, name: "Master Explorer", achieved: prevStats.completedCategories >= 5 }
                ]
              },
              {
                name: "Mission Completer",
                icon: "🎯",
                levels: [
                  { threshold: 1, name: "Rookie", achieved: prevStats.completedMissions >= 1 },
                  { threshold: 5, name: "Veteran", achieved: prevStats.completedMissions >= 5 },
                  { threshold: 10, name: "Legend", achieved: prevStats.completedMissions >= 10 }
                ]
              },
              {
                name: "Global Rank",
                icon: "🏆",
                levels: [
                  { threshold: thresholds.rank100 || 0, name: "Top 100", achieved: userRank <= 100 },
                  { threshold: thresholds.rank50 || 0, name: "Top 50", achieved: userRank <= 50 },
                  { threshold: thresholds.rank20 || 0, name: "Top 20", achieved: userRank <= 20 },
                  { threshold: thresholds.rank10 || 0, name: "Top 10", achieved: userRank <= 10 },
                  { threshold: thresholds.rank3 || 0, name: "Top 3", achieved: userRank <= 3 },
                  { threshold: thresholds.rank1 || 0, name: "Rank 1", achieved: userRank === 1 }
                ]
              }
            ];

            return {
              ...prevStats,
              leaderboardRank: userRank,
              learningPoints: Number.parseInt(userData.learning_points) || 0,
              experiencePoints: Number.parseInt(userData.experience_points) || 0,
              leaderboardPoints: Number.parseInt(userData.total_points) || 0,
              achievements
            };
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard rank:', error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.user_id) {
        setDataLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/dashboard/${user.user_id}`);
        
        // Process subcategories
        const subcategoriesMap = new Map();
        
        for (const item of response.data.progress) {
          if (item.subcategory_id === null || item.category_name === null) continue;
          
          if (!subcategoriesMap.has(item.subcategory_id)) {
            subcategoriesMap.set(item.subcategory_id, {
              id: item.subcategory_id,
              name: item.subcategory_name,
              levels: [],
              totalBites: 0,
              completedBites: 0
            });
          }
          
          const subCategory = subcategoriesMap.get(item.subcategory_id);
          subCategory.levels.push({
            name: item.category_name,
            progress: Number.parseFloat(item.completion_percentage) / 100,
            totalBites: Number.parseInt(item.total_bites),
            completedBites: Number.parseInt(item.completed_bites)
          });
          
          subCategory.totalBites += Number.parseInt(item.total_bites);
          subCategory.completedBites += Number.parseInt(item.completed_bites);
        }
        
        const formattedCategories = Array.from(subcategoriesMap.values()).map(sub => ({
          id: sub.id,
          name: sub.name,
          progress: sub.totalBites > 0 ? sub.completedBites / sub.totalBites : 0,
          color: "bg-blue-500",
          levels: sub.levels
        }));
        
        setCategories(formattedCategories);
        
        const completedSubcategories = new Set(
          response.data.progress
            .filter(item => Number.parseInt(item.completed_bites) > 0)
            .map(item => item.subcategory_id)
        ).size;
  
        setUserStats(prevStats => ({
          ...prevStats,
          learningStreak: response.data.learningStreak,
          completedCategories: completedSubcategories,
          completedMissions: response.data.missionStats.completed_missions
        }));
  
        await fetchLeaderboardRank();
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  const toggleCategory = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    setSelectedCategory(selectedCategory?.id === category?.id ? null : category);
    setSelectedAchievement(null);
  };

  const handleAchievementSelect = (achievementName, currentValue, additionalData = null) => {
    // Log the incoming data
    console.log('Achievement Selection Input:', {
      achievementName,
      currentValue,
      additionalData,
      achievements: userStats.achievements
    });

    // Find the achievement by name
    const achievement = userStats.achievements.find(a => a.name === achievementName);
    
    if (!achievement) {
      console.error('Achievement not found:', achievementName);
      return;
    }

    // Set the selected achievement with all required data
    setSelectedAchievement({
      achievement,
      currentValue,
      additionalData
    });
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/register'); // Redirect to /register if user is not logged in
    }
  }, [user, loading, navigate]); // Depend on user and loading state

  if (loading || dataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="nft-dashboard-container">
      <UserStatsCard 
        userStats={userStats} 
        onAchievementSelect={handleAchievementSelect}
      />
      
      <CategoryList 
        categories={categories} 
        onCategorySelect={toggleCategory} 
      />
      
      {selectedCategory && (
        <CategoryDetailModal 
          category={selectedCategory}
          nftPreviewTemplate={nftPreviewTemplate}
          user={user}
        />
      )}

      {selectedAchievement && (
        <AchievementDetailModal
          achievement={selectedAchievement.achievement}
          currentValue={selectedAchievement.currentValue}
          additionalData={selectedAchievement.additionalData}
          nftPreviewTemplate={nftPreviewTemplate}
          user={user}
        />
      )}
    </div>
  );
};

export default CategoryNFTDashboard;