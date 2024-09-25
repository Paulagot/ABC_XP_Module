import React from "react";
import MissionStatus from "./missionstatus.jsx";
import MissionUserActionStatus from "./MissionActionStatus.jsx";



function Mission_Cards({ lockedMissions = [], unlockedMissions = [] }) {
  console.log('Rendering Mission_Cards with Locked Missions:', lockedMissions);
  console.log('Rendering Mission_Cards with Unlocked Missions:', unlockedMissions);
  return (
      <div className="container_bites">
          <div className = "mission_container_content">
            {lockedMissions.length > 0 && lockedMissions.map((mission, index) => (
                 
                 <div key={index} className=" mission_card_content locked">
                        <div className="mission_card">
                            <div className="front">


                                <img src={mission.thumbnail} alt="mission-img" className="mission_img" />
                                <p className="mission-name">{mission.name}</p>



                            </div>                        
                            <div className="back">
                                {/* Pass mission, criteria, and userBytes to MissionStatus */}
                                <MissionStatus mission={mission} criteria={mission.criteria} userBytes={mission.userBytes} />
                            </div>

                          </div>
                  </div>
              ))}
          </div>
          
          <div className = "mission_container_content">
                {unlockedMissions.length > 0 && unlockedMissions.map((mission, index) => (
                    <div key={index} className="mission_card_content unlocked">
                        <div className="mission_card">
                              <div className="front">
                                  <img src={mission.thumbnail} alt="mission-img" className="mission_img" />
                                  <p className="mission-name">{mission.name}</p>
                              </div>                        
                              <div className="back">
                                    <MissionUserActionStatus mission={mission} />
                              </div>
                          </div>
                      </div>
                  ))}
            </div>
      </div>
  );
}

export default Mission_Cards;