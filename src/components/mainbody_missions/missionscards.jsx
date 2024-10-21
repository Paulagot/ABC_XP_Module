import React from "react";
import MissionStatus from "./missionstatus.jsx";
import UserProgressStatus from "./userprogress.jsx";


// Mission_Cards component: Responsible for rendering mission cards, including both locked and unlocked missions
function Mission_Cards({ lockedMissions = [], unlockedMissions = [] }) {
  console.log('Rendering Mission_Cards with Locked Missions:', lockedMissions);
  console.log('Rendering Mission_Cards with Unlocked Missions:', unlockedMissions);

  return (
    <div className="container_missions">
      
      {/* Unlocked Missions */}
      <div className="mission_container_content">
        {unlockedMissions.length > 0 &&
          unlockedMissions.map((mission, index) => (
            <div key={index} className="mission_card_content unlocked">
              <div className="mission_card">
                {/* Front of the card: Mission details */}
                <div className="front">
                  <img
                    src={mission.thumbnail}  // Display the mission thumbnail image
                    alt="mission-img"
                    className="mission_img"
                  />
                    <div className="mission_top_content">
                        {mission.sponsor_img && (
                            <div className="byte-sponsor-logo-container">
                                <img src={mission.sponsor_img} alt="sponsor-logo" className="byte-sponsor-logo" />
                            </div>
                        )}
                     </div>

                   <div className="mission_lower_content">
                        <p className="mission-name">{mission.name}</p> {/* Mission Name */}
                        <div className="mission_points_container">
                            <p className="mission_points">eXp: {mission.xp}</p> {/* Mission XP */}
                        </div>
                   </div>
                </div>

                {/* Back of the card: Redirects to mission URL when clicked */}
                <div className="back">
                  {/* Pass individual unlocked mission details to UserProgressStatus, including the URL */}
                  <UserProgressStatus mission={mission} />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Locked Missions */}
      <div className="mission_container_content">
        {lockedMissions.length > 0 &&
          lockedMissions.map((mission, index) => (
            <div key={index} className="mission_card_content locked">
              <div className="mission_card">
                {/* Front of the card: Mission details */}
                <div className="front">
                  <img
                    src={mission.thumbnail}  // Display the mission thumbnail image
                    alt="mission-img"
                    className="mission_img"
                  />
                  <div className="mission_top_content">
                      {mission.sponsor_img && (
                          <div className="byte-sponsor-logo-container">
                              <img src={mission.sponsor_img} alt="sponsor-logo" className="byte-sponsor-logo" />
                          </div>
                      )}
                  </div>

                  <div className="mission_lower_content">
                      <p className="mission-name">{mission.name}</p> {/* Mission Name */}
                      <div className="mission_points_container">
                          <p className="mission_points">eXp: {mission.xp}</p> {/* Mission XP */}
                      </div>
                  </div>
                </div>

                {/* Back of the card: Locked mission status */}
                <div className="back">
                  {/* Pass individual locked mission details to MissionStatus */}
                  <MissionStatus
                    mission={mission}
                    criteria={mission.criteria}
                    userBytes={mission.userBytes}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Mission_Cards;