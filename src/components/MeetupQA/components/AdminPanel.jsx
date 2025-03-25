// Updated AdminPanel.jsx with end session button
import React, { useState } from 'react';

const AdminPanel = ({ sessionCode, onSetTimer, timer, participants, onEndSession }) => {
  const [minutes, setMinutes] = useState(5);
  const [isEnding, setIsEnding] = useState(false);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const copySessionCode = () => {
    navigator.clipboard.writeText(sessionCode)
      .then(() => alert('Session code copied to clipboard!'))
      .catch(err => console.error('Failed to copy session code:', err));
  };
  
  const handleEndSession = async () => {
    if (window.confirm("Are you sure you want to end this Q&A session? All questions and votes will be lost.")) {
      setIsEnding(true);
      try {
        await onEndSession();
      } catch (err) {
        console.error("Error ending session:", err);
        setIsEnding(false);
      }
    }
  };
  
  return (
    <div className="admin-panel">
           
      <div className="session-info">
        <div>
          <strong>Session Code:</strong> 
          <span className="session-code">{sessionCode}</span>
          <button 
            className="copy-button"
            onClick={copySessionCode}
            title="Copy to clipboard"
          >
            📋
          </button>
        </div>
        
        <div className='participants-count'>
          <strong>Participants:</strong> {participants.length}
        </div>

        <div className="admin-actions">
        <button 
          className="end-session-button"
          onClick={handleEndSession}
          disabled={isEnding}
        >
          {isEnding ? 'Ending...' : 'End Session'}
        </button>
      </div>
      </div>
      
      <div className="timer-controls">
        <div className="timer-display">
          {timer > 0 ? formatTime(timer) : "00:00"}
        </div>
        
        <div className="timer-inputs">
          <input
            type="number"
            min="1"
            max="60"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            disabled={isEnding}
          />
          <button 
            className="set-timer-button"
            onClick={() => onSetTimer(minutes)}
            disabled={isEnding}
          >
            Set Timer
          </button>
        </div>
      </div>
      
      
    </div>
  );
};

export default AdminPanel;
