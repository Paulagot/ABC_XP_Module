import React from "react";

// this popup will happen when a user completes a Byte
//it will be a back end function auto triggered by something**


const LearningAchievement = ({ Byte, learningPoints, missions }) => {
    return (
      <div className="achievement-popup">
        <div className="header">
          <span role="img" aria-label="Star">🌟</span> Congratulations! <span role="img" aria-label="Star">🌟</span>
        </div>
        <div className="Byte-name">{Byte}</div>
        <div className="learning-points">
          <strong>Learning Points Achieved:</strong>
          {learningPoints.map((point, index) => (
            <div key={index}>{point.topic}: {point.points} points</div>
          ))}
        </div>
        <div className="unlocked-missions">
          <strong>You've unlocked new missions!</strong>
          <div>Keep up the great work! <span role="img" aria-label="Confetti">🎊</span></div>
        </div>
      </div>
    );
  };
  
  export default LearningAchievement;