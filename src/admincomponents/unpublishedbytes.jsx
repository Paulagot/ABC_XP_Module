import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UnpublishedBitesTable = () => {
  const [bites, setBites] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/bites/unpublished`)
      .then(response => {
        setBites(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the unpublished bites!', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      
      {bites.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Unpublished Bites</th>
            </tr>
          </thead>
          <tbody>
            {bites.map((bite, index) => (
              <tr key={index}>
                <td>{bite.name}</td>
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

export default UnpublishedBitesTable;

