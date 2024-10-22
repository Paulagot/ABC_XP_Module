import { useEffect, useState } from "react";
import Mission_Cards from "./missionscards";


// Function to evaluate if the user meets the mission criteria
const evaluateCriteria = (criteriaList, userBytes) => {
    let isLocked = false;
    for (let i = 0; i < criteriaList.length; i++) {
        const criterion = criteriaList[i];

        if (criterion.criteria_type === 'Bite Complete') {
            const userHasCompleted = userBytes.some(
                byte => byte.bite_id === criterion.bite_id && byte.completion_date !== null
            );
            if (!userHasCompleted) {
                isLocked = true;
                break;
            }
        } else if (criterion.lp_value) {
            const userLP = userBytes
                .filter(byte => byte.subcategory_id === criterion.subcategory_id)
                .reduce((total, byte) => total + byte.lp_value, 0);
            if (userLP < criterion.lp_value) {
                isLocked = true;
                break;
            }
        }
    }
    return isLocked;
};

// Function to determine the mission status
const getMissionStatus = (mission, userMissionsData) => {
    const userMission = userMissionsData.find((ub) => ub.mission_id === mission.mission_id);

    if (userMission && userMission.start_date && !userMission.completion_date) {
        return { text: "Continue Mission", className: "started", order: 1 }; // Continue Mission
    }

    if (userMission && userMission.completion_date) {
        return { text: "Mission Complete", className: "completed", order: 3 }; // Mission Complete
    }

    // Default: Explore Mission
    return { text: "Explore Mission", className: "not-enrolled", order: 2 };
};

function MissionEvaluator({ missions = [], criteria = [], userBytes = [], userId }) {
    const [lockedMissions, setLockedMissions] = useState([]);
    const [unlockedMissions, setUnlockedMissions] = useState([]);
    const [userMissionsData, setUserMissionsData] = useState([]);

    // Fetch userMissions data (for logged-in users)
    useEffect(() => {
        if (userId) {
            const fetchUserMissions = async () => {
                try {
                    const response = await fetch(`http://16.171.3.129:3000/api/user_missions?user_id=${userId}`);
                    const data = await response.json();
                    setUserMissionsData(data); // Store userMissions data
                } catch (error) {
                    console.error('Error fetching user missions:', error);
                }
            };

            fetchUserMissions();
        }
    }, [userId]);

    useEffect(() => {
        const evaluateMissions = async () => {
            const locked = [];
            const unlocked = [];

            // Iterate over each mission to determine if it's locked or unlocked
            missions.forEach(mission => {
                const missionCriteria = criteria.filter(c => c.mission_id === mission.mission_id);
                const isLocked = evaluateCriteria(missionCriteria, userBytes);

                if (isLocked) {
                    // If locked, push to lockedMissions array
                    locked.push({ ...mission, missionStatus: 'locked', criteria: missionCriteria, userBytes });
                } else {
                    // Determine the mission status (started, not-enrolled, or completed)
                    const status = getMissionStatus(mission, userMissionsData);

                    // Push the unlocked mission with its status to unlockedMissions array
                    unlocked.push({ ...mission, ...status, userBytes, userId });
                }
            });

            // Sort the unlocked missions based on their status order (1 = Continue, 2 = Explore, 3 = Complete)
            const sortedUnlockedMissions = unlocked.sort((a, b) => a.order - b.order);

            // Update state with locked and unlocked missions
            setLockedMissions(locked);
            setUnlockedMissions(sortedUnlockedMissions);
        };

        evaluateMissions();
    }, [missions, criteria, userBytes, userMissionsData, userId]);

    return (
        <Mission_Cards 
            unlockedMissions={unlockedMissions} 
            lockedMissions={lockedMissions} 
        />
    );
}

export default MissionEvaluator;
