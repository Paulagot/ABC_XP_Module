import React from "react";
import Confetti from "react-confetti";

const MissionCompletePopup = ({ mission, userName, xpEarned, onClose }) => {
    return (
        <div className="achievement-popup">
            <Confetti numberOfPieces={300} />
            <div className="header">
                <span role="img" aria-label="Star">🌟</span> Congratulations {userName}! <span role="img" aria-label="Star">🌟</span>
            </div>
            <div className="mission-name">You completed: {mission}</div>
            <div className="xp-earned">
                <strong>eXperience Points Earned:</strong> {xpEarned} XP
            </div>
            <div className="close-button" onClick={onClose}>Close</div>
        </div>
    );
};

export default MissionCompletePopup;