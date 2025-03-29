import { useEffect, useState } from "react";
import Mission_Cards from "./missionscards";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Helper function to evaluate if the user meets the mission criteria.
 * Returns `true` if the mission is locked, otherwise `false`.
 */
const evaluateCriteria = (criteriaList, userBytes) => {
    let isLocked = false;

    for (let i = 0; i < criteriaList.length; i++) {
        const criterion = criteriaList[i];

        if (criterion.criteria_type === 'Bite Complete') {
            const userHasCompleted = userBytes.some(
                (byte) => byte.bite_id === criterion.bite_id && byte.completion_date !== null
            );
            if (!userHasCompleted) {
              
                isLocked = true;
                break;
            }
        } else if (criterion.lp_value) {
            const userLP = userBytes
                .filter((byte) => byte.subcategory_id === criterion.subcategory_id)
                .reduce((total, byte) => total + (byte.lp_value || 0), 0);

            if (userLP < criterion.lp_value) {
               
                isLocked = true;
                break;
            }
        }
    }

    return isLocked;
};

/**
 * Helper function to determine the mission status based on user progress.
 * Returns an object with `text`, `className`, and `order`.
 */
const getMissionStatus = (mission, userMissionsData) => {
    const userMission = userMissionsData.find((um) => um.mission_id === mission.mission_id);

    if (userMission && userMission.start_date && !userMission.completion_date) {
        return { text: "Continue Mission", className: "started", order: 1 }; // Continue Mission
    }

    if (userMission && userMission.completion_date) {
        return { text: "Mission Complete", className: "completed", order: 3 }; // Mission Complete
    }

    // Default: Explore Mission
    return { text: "Explore Mission", className: "not-enrolled", order: 2 };
};

/**
 * MissionEvaluator Component: Evaluates and separates locked and unlocked missions.
 */
function MissionEvaluator({ missions = [], criteria = [], userBytes = [], userId, isReadyToRender }) {
    const [lockedMissions, setLockedMissions] = useState([]);
    const [unlockedMissions, setUnlockedMissions] = useState([]);
    const [userMissionsData, setUserMissionsData] = useState([]);

    // Fetch user mission progress data
    useEffect(() => {
        if (userId) {
            const fetchUserMissions = async () => {
                try {
             
                    const response = await fetch(`${API_BASE_URL}/api/user_missions?user_id=${userId}`);
                    const data = await response.json();
                   
                    setUserMissionsData(data);
                } catch (error) {
                    console.error("[MissionEvaluator] Error fetching user missions:", error);
                }
            };

            fetchUserMissions();
        }
    }, [userId]);

    // Evaluate missions and classify as locked/unlocked
    useEffect(() => {
        if (!missions || !criteria || !isReadyToRender) return; // Prevent premature evaluation
        const evaluateMissions = () => {
            const locked = [];
            const unlocked = [];

            missions.forEach((mission) => {
                // Get criteria for the mission
                const missionCriteria = criteria.filter((c) => c.mission_id === mission.mission_id);

                // Evaluate if the mission is locked
                const isLocked = evaluateCriteria(missionCriteria, userBytes);

                if (isLocked) {
                  
                    locked.push({ ...mission, missionStatus: "locked", criteria: missionCriteria, userBytes });
                } else {
                    // Get mission status for unlocked missions
                    const status = getMissionStatus(mission, userMissionsData);
                   

                    unlocked.push({ ...mission, ...status, userBytes, userId });
                }
            });

            // Sort unlocked missions by their status order
            const sortedUnlockedMissions = unlocked.sort((a, b) => a.order - b.order);

            setLockedMissions(locked);
            setUnlockedMissions(sortedUnlockedMissions);
        };

        evaluateMissions();
    }, [missions, criteria, userBytes, userMissionsData, userId, isReadyToRender]);

    return (
        <Mission_Cards
            unlockedMissions={unlockedMissions}
            lockedMissions={lockedMissions}
        />
    );
}

export default MissionEvaluator;
