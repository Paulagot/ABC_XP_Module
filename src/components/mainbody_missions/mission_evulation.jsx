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


function MissionEvaluator({ missions = [], criteria = [], userBytes = [], userId }) {
    const [lockedMissions, setLockedMissions] = useState([]);
    const [unlockedMissions, setUnlockedMissions] = useState([]);

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
    console.log('locked missions passed',lockedMissions)
                    locked.push({ ...mission, missionStatus: 'locked', criteria: missionCriteria ,userBytes });
                } else {                     
                    // Push the unlocked mission with its status to unlockedMissions array
                    unlocked.push({ ...mission, criteria: missionCriteria, userBytes });
                }
            });
    
            // Update state with locked and unlocked missions
            setLockedMissions(locked);
            setUnlockedMissions(unlocked);
        };
    
        evaluateMissions();
    }, [missions, criteria, userBytes, userId]);
    
    console.log('unlocked missions passed',unlockedMissions)
    console.log('locked missions passed',lockedMissions)

    return (
        <Mission_Cards 
        lockedMissions={lockedMissions} 
        unlockedMissions={unlockedMissions} 
        />
    );
}

export default MissionEvaluator;



