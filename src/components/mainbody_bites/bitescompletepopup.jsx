import React, { useState } from "react";
import AchievementLogic from "./achievementlogic"; // Import AchievementLogic



const LearningAchievement = ({ userId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [completedByte, setCompletedByte] = useState(null);
  const [missions, setMissions] = useState([]);
  const [userName, setUserName] = useState("");

  // Callback to handle achievement data, invoked from AchievementLogic
  const handleAchievementData = (newByte, unlockedMissions, name) => {
      setCompletedByte(newByte); // Set the completed byte details
      setMissions(unlockedMissions); // Set unlocked missions, now with mission names
      setUserName(name); // Set the user's name for display
      setShowPopup(true); // Show the popup with the updated data
      console.log("Popup state updated to show with completed byte:", newByte, "and unlocked missions:", unlockedMissions);
  };

  // Close the popup when the user clicks the close button
  const closePopup = () => setShowPopup(false);

  return (
      <>
          {showPopup && (
              <div className="achievement-popup">
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