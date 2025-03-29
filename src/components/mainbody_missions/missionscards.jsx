import React from "react";
import MissionStatus from "./missionstatus.jsx";
import UserProgressStatus from "./userprogress.jsx";



function Mission_Cards({ lockedMissions = [], unlockedMissions = [] }) {
    if (lockedMissions.length === 0 && unlockedMissions.length === 0) {
        return <div>Loading mission cards...</div>; // Prevent premature rendering
    }

    // Helper function to determine box-shadow based on `mission.text`
    const getBoxShadowStyle = (text) => {
        if (text === "Mission Complete") {
            return { boxShadow: "10px 10px 25px rgba(255, 215, 0, 0.6)" }; // Gold shadow
        }
        if (text === "Continue Mission") {
            return { boxShadow: "10px 10px 15px #285c41" }; // Green shadow
        }
        return { boxShadow: "10px 10px 15px rgb(229, 93, 93)" }; // Red shadow for "Explore Mission"
    };

    return (
        <div className="container_missions">
            {/* Unlocked Missions */}
            <div className="mission_container_content">
                {unlockedMissions.length > 0 &&
                    unlockedMissions.map((mission, index) => (
                        <div key={index} className="mission_card_content unlocked">
                            <div
                                className="mission_card"
                                style={getBoxShadowStyle(mission.text)} // Apply dynamic style
                            >
                                {/* Front of the card: Mission details */}
                                <div className="front">
                                    <img
                                        src={mission.thumbnail} // Display the mission thumbnail image
                                        alt="mission-img"
                                        className="mission_img"
                                    />
                                    <div className="mission_top_content">
                                        {mission.sponsor_img && (
                                            <div className="byte-sponsor-logo-container">
                                                <img
                                                    src={mission.sponsor_img}
                                                    alt="sponsor-logo"
                                                    className="byte-sponsor-logo"
                                                />
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

                                {/* Back of the card: Unlocked mission status */}
                                <div className="back">
                                    {/* Use UserProgressStatus to handle status and click functionality */}
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
                                        src={mission.thumbnail} // Display the mission thumbnail image
                                        alt="mission-img"
                                        className="mission_img"
                                    />
                                    <div className="mission_top_content">
                                        {mission.sponsor_img && (
                                            <div className="byte-sponsor-logo-container">
                                                <img
                                                    src={mission.sponsor_img}
                                                    alt="sponsor-logo"
                                                    className="byte-sponsor-logo"
                                                />
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

                                {/* Back of the card: Locked mission criteria */}
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

