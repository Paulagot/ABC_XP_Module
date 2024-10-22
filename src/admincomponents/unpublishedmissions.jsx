import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UnpublishedMissionsTable = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://16.171.3.129:3000/api/missions/unpublished')
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
