import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UnpublishedMissionsTable = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/missions/unpublished`)
      .then(response => {
        setMissions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the unpublished missions!', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
     
      {missions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Unpublished Missions</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((mission, index) => (
              <tr key={index}>
                <td>{mission.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No unpublished content</p>
      )}
    </div>
  );
};

export default UnpublishedMissionsTable;
