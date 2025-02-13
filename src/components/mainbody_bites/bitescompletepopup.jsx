import React, { useState } from "react";
import AchievementLogic from "./achievementlogic"; // Import AchievementLogic
import ConfettiBoom from "react-confetti-boom";



const LearningAchievement = ({ userId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [completedByte, setCompletedByte] = useState(null);
  const [missions, setMissions] = useState([]);
  const [userName, setUserName] = useState("");

    // Simulate test data
    const triggerTestPopup = () => {
        setCompletedByte({ byte_name: "Intro to Web3" });
        setMissions([{ mission_id: 1, mission_name: "Create Your Wallet" }]);
        setUserName("Test User");
        setShowPopup(true);
      };

  // Callback to handle achievement data, invoked from AchievementLogic
  const handleAchievementData = (newByte, unlockedMissions, name) => {
      setCompletedByte(newByte); // Set the completed byte details
      setMissions(unlockedMissions); // Set unlocked missions, now with mission names
      setUserName(name); // Set the user's name for display
      setShowPopup(true); // Show the popup with the updated data
     
  };

  // Close the popup when the user clicks the close button
  const closePopup = () => setShowPopup(false);

  

  return (
      <>
       {/* <button onClick={triggerTestPopup}>Test Popup</button> */}
          {showPopup && (
              <div className="achievement-popup">
                   {/* Render ConfettiBoom */}
                     {/* ConfettiBoom wrapped in a container with proper positioning */}
          <div className="confetti-container">
            <ConfettiBoom
           mode="boom"
              particleCount={300}
              spread={150}
              duration={3500}
              colors={["#f39c12", "#e74c3c", "#3498db", "#2ecc71"]}
              
            />
          </div>
        
                  <div className="popup-content">
            
                    
                      <h3><span role="img" aria-label="Star">🌟</span>Congratulations, {userName}!<span role="img" aria-label="Star">🌟</span></h3>
                      <p>You've completed the byte: <br></br> {completedByte?.byte_name || "Unnamed Byte"}</p>
                      {missions.length > 0 && (
                          <div>
                              <h4>Newly Unlocked Missions:</h4>
                              <ul>
                                  {missions.map((mission) => (
                                      <li key={mission.mission_id}>
                                          {mission.mission_name || `Unnamed Mission ${mission.mission_id}`}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                      <button className="close-button" onClick={closePopup}>Close</button>
                  </div>
              </div>
          )}
          <AchievementLogic userId={userId} onAchievement={handleAchievementData} />
      </>
  );
};

export default LearningAchievement;