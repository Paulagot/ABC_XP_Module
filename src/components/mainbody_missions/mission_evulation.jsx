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

// Function to fetch the mission status for a user
const fetchUserMissionStatuses = async (userId) => {
    try {
        const response = await fetch(`/api/user_missions?user_id=${userId}`);
        const data = await response.json();
        return data; // Expect an array of user missions
    } catch (error) {
        console.error("Error fetching user mission statuses:", error);
        return [];
    }
};

function MissionEvaluator({ missions = [], criteria = [], userBytes = [], userId }) {
    const [lockedMissions, setLockedMissions] = useState([]);
    const [unlockedMissions, setUnlockedMissions] = useState([]);

    useEffect(() => {
        const evaluateMissions = async () => {
            const locked = [];
            const unlocked = [];
    
            // Fetch user mission statuses (start date and completion date)
            const userMissionStatuses = await fetchUserMissionStatuses(userId);
    
            // Iterate over each mission to determine if it's locked or unlocked
            missions.forEach(mission => {
                const missionCriteria = criteria.filter(c => c.mission_id === mission.mission_id);
                const isLocked = evaluateCriteria(missionCriteria, userBytes);
    
                if (isLocked) {
                    // If locked, push to lockedMissions array
                    locked.push({ ...mission, missionStatus: 'locked', criteria: missionCriteria });
                } else {
                    // If unlocked, determine user mission status from the fetched data
                    const userMissionStatus = userMissionStatuses.find(
                        status => status.mission_id === mission.mission_id
                    );
                    
    
                    // Determine the mission's status
                    let status;
                    if (userMissionStatus) {
                        status = userMissionStatus.completion_date
                            ? 'completed'
                            : userMissionStatus.start_date
                                ? 'in-progress'
                                : 'not-accepted';  // This case should not happen, but for safety.
                    } else {
                        // No entry in userMissionStatuses means 'not-accepted'
                        status = 'not-accepted';
                    }

                    console.log('usermissionstatus',userMissionStatuses)
    
                    // Push the unlocked mission with its status to unlockedMissions array
                    unlocked.push({ ...mission, missionStatus: status, criteria: missionCriteria });
                }
            });
    
            // Update state with locked and unlocked missions
            setLockedMissions(locked);
            setUnlockedMissions(unlocked);
        };
    
        evaluateMissions();
    }, [missions, criteria, userBytes, userId]);
    
    console.log('unlocked missions',unlockedMissions)

    return (
        <Mission_Cards lockedMissions={lockedMissions} unlockedMissions={unlockedMissions} />
    );
}

export default MissionEvaluator;



