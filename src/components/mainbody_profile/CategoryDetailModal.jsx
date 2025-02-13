// CategoryDetailModal.jsx

import React, { useState, useEffect } from 'react';
import CategoryProgressDetails from './CategoryProgressDetails';
import NFTPreviewCard from './NFTPreviewCard';
import RecommendedBytes from './RecommendedBytes';
import axios from 'axios';

const CategoryDetailModal = ({ category, nftPreviewTemplate, user }) => {
  const [missions, setMissions] = useState([]);
  const [missionStats, setMissionStats] = useState({
    total_missions: 0,
    unlocked_missions: 0,
    completed_missions: 0
  });
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchMissions = async () => {
      if (!user?.user_id || !category?.id) return;

      try {
        const [progressResponse, unlockResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/mission-progress/${user.user_id}/${category.id}`),
          axios.get(`${API_BASE_URL}/api/mission-unlock/${user.user_id}`)
        ]);

        setMissions(progressResponse.data);

        const categoryMissions = unlockResponse.data.filter(
          mission => mission.subcategory_id === category.id
        );

        setMissionStats({
          total_missions: progressResponse.data.length,
          unlocked_missions: categoryMissions.filter(m => m.is_unlocked).length,
          completed_missions: progressResponse.data.filter(m => m.status === 'completed').length
        });
      } catch (error) {
        console.error('Failed to fetch missions:', error);
      }
    };

    fetchMissions();
  }, [category?.id, user?.user_id]);

  if (!category || !user) return null;

  const totalProgress = category.progress * 100;
  const completedLevels = category.levels.filter(level => level.progress >= 1).length;
  const totalLevels = category.levels.length;

  const updatedNFTTemplate = {
    ...nftPreviewTemplate,
    overlayDetails: [
      { label: "Category", value: category.name },
      { label: "Levels Completed", value: `${completedLevels}/${totalLevels}` },
      { label: "Total Progress", value: `${totalProgress.toFixed(0)}%` },
      { label: "Missions Completed", value: `${missionStats.completed_missions}/${missionStats.total_missions}` }
    ]
  };

  return (
    <div className="category-detail-grid">
      <CategoryProgressDetails 
        category={category}
        missionStats={missionStats}
      />
      <NFTPreviewCard 
        nftPreviewTemplate={updatedNFTTemplate}
        categoryName={category.name}
      />
      <RecommendedBytes 
        userId={user.user_id}
        subcategoryId={category.id}
      />
    </div>
  );
};

export default CategoryDetailModal;