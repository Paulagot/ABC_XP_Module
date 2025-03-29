import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MissionCardWireframe from '../mainbody_bites/wireframe.jsx';

const RecommendedBytes = ({ userId, subcategoryId }) => {
  const [recommendedBytes, setRecommendedBytes] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchRecommendedBytes = async () => {
      try {
        // Fetch both progress data and full bytes data
        const [progressResponse, bytesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/progress/${userId}/${subcategoryId}`),
          axios.get(`${API_BASE_URL}/api/bitescards`)
        ]);

        // Filter progress data for null progress
        const nullProgressBytes = progressResponse.data
          .filter(byte => byte.course_progress === null)
          .slice(0, 2); // Take first two null progress bytes

        if (nullProgressBytes.length === 0) return;

        // Get full byte details for the selected null progress bytes
        const fullBytesData = nullProgressBytes.map(progressByte => {
          const fullByte = bytesResponse.data.find(b => b.bite_id === progressByte.bite_id);
        
          return fullByte ? {
            bite_id: fullByte.bite_id,
            name: fullByte.name,
            points: fullByte.points,
            thumbnail: fullByte.thumbnail,
            subtitle: fullByte.subtitle,
            url: fullByte.url,
            landing_page_url: fullByte.landing_page_url || '/landing/byte/default',
            sponsor_id: fullByte.sponsor_id,
            sponsor_img: fullByte.sponsor_img
          } : null;
        }).filter(byte => byte !== null); // Remove any bytes we couldn't find full data for

        setRecommendedBytes(fullBytesData);
      } catch (error) {
        console.error('Failed to fetch recommended bytes:', error);
      }
    };

    if (userId && subcategoryId) {
      fetchRecommendedBytes();
    }
  }, [userId, subcategoryId]);

  if (recommendedBytes.length === 0) return null;

  return (
    <div className="recommended-bytes">
      <h3 className="text-lg font-semibold mb-4">Recommended Bytes</h3>
      <MissionCardWireframe item={recommendedBytes} />
    </div>
  );
};

export default RecommendedBytes;