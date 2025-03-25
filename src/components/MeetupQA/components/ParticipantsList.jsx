
// components/ParticipantsList.jsx
import React from 'react';

const ParticipantsList = ({ participants }) => {
  return (
    <div className="meetup-qa-participants">
            <ul>
        {participants.map(p => (
          <li key={p.name}>
            <span>{p.name} {p.isAdmin ? '(Admin)' : ''}</span>
            <div className="vote-dots">
              {Array(5).fill(0).map((_, i) => (
                <span 
                  key={i} 
                  className={`vote-dot ${i >= p.votes ? 'vote-dot-used' : ''}`}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsList;