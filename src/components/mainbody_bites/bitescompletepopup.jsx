import React, { useState } from "react";
import AchievementLogic from "./achievementlogic"; // Import AchievementLogic



const LearningAchievement = ({ userId }) => {
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [completedByte, setCompletedByte] = useState({}); // State to store the last completed byte data
    const [missions, setMissions] = useState([]); // State to store unlocked missions
    const [userName, setUserName] = useState(""); // State to store the user's name

    // Function to handle data from AchievementLogic and trigger popup
    const handleAchievementData = (byte, newMissions, user) => {
        console.log("handleAchievementData called with:", byte, newMissions, user); // Debug log to ensure this function is called

        if (byte) {
            setCompletedByte(byte); // Set the data of the completed byte
            setMissions(newMissions); // Set any new missions unlocked
            setUserName(user); // Set the user's name from the logic
            setShowPopup(true); // Show the popup if there's a new completion
            console.log("Popup state updated to show with completed byte:", byte, "and user:", user); // Log state update
        } else {
            console.log("No valid byte data received, popup will not be shown.");
        }
    };

    return (
        <>
            {/* Render the AchievementLogic component and pass the handler function */}
            <AchievementLogic userId={userId} onAchievement={handleAchievementData} />
            
            {/* Conditionally render the popup */}
            {showPopup && (
                <div className="popup-overlay"> {/* Popup overlay for dimmed background */}
                    <div className="achievement-popup">
                        <div className="popup-header">
                            <span role="img" aria-label="Star">🌟</span> Congratulations! {userName} <span role="img" aria-label="Star">🌟</span>
                            <button onClick={() => setShowPopup(false)} className="close-button">X</button>
                        </div>
                        <div className="achievement-message">
                            You have successfully completed the byte <strong>{completedByte.byte_name}</strong>!
                        </div>
                        {/* Show unlocked missions if any */}
                        {missions.length > 0 && (
                            <div className="unlocked-missions">
                                <strong>You've unlocked new missions!</strong>
                                {missions.map((mission, index) => (
                                    <div key={index}>{mission.mission_name}: {mission.subtitle}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default LearningAchievement;