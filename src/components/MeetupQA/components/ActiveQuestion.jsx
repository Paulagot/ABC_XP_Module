// ActiveQuestion.jsx - Simplified version
import React from 'react';
import QuestionReplies from './QuestionReplies';

const ActiveQuestion = ({ 
  question, 
  timer, 
  replies = [], 
  currentUser, 
  isAdmin, 
  onAddReply, 
  onPinReply, 
  onDeleteReply,
  showTimeVote
}) => {
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Simplified timer display logic
  const getTimerDisplay = () => {
    // If no active question, don't show anything
    if (!question) {
      return "";
    }
    
    // Time vote has priority
    if (showTimeVote) {
      return "Time's up!";
    }
    
    // If timer is null, show "Setting Time..."
    if (timer === null || timer === undefined) {
      return "Setting Time...";
    }
    
    // If timer is 0, show "Time's up!"
    if (timer === 0) {
      return "Time's up!";
    }
    
    // Otherwise, show the countdown
    return formatTime(timer);
  };

  // Debug what we're displaying
  console.log("ActiveQuestion rendering:", {
    hasQuestion: !!question,
    timer: timer,
    timerDisplay: getTimerDisplay(),
    showTimeVote: showTimeVote,
    replyCount: replies.length
  });

  return (
    <div className="active-question">
      {/* Always show the header */}
      <div className="active-question-header">
        <h2>Current Discussion</h2>
      </div>
      
      {/* Conditional content */}
      {question ? (
        <>
          <div className="active-question-timer">
            {getTimerDisplay()}
          </div>
          <QuestionReplies
            questionId={question.id}
            sessionId={question.sessionId}
            replies={replies}
            currentUser={currentUser}
            isAdmin={isAdmin}
            onAddReply={(text) => onAddReply(question.id, text)}
            onPinReply={onPinReply}
            onDeleteReply={onDeleteReply}
          />

          <div className="active-question-card">
            <div className="active-question-text">
              {question.text}
            </div>
            <div className="active-question-author">
              Asked by {question.author}
            </div>
          </div>
          
        
        </>
      ) : (
        <div className="no-active-question">
          <p>No question is currently active</p>
          {isAdmin && (
            <div className="admin-drag-hint">
              Drag a question from the list to this area to make it active
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveQuestion;