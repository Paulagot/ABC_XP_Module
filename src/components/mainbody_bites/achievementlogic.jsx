import React, { useEffect, useState } from "react";

const AchievementLogic = ({ userId, onAchievement }) => {
    const [userName, setUserName] = useState("");

    // Function to fetch mission names from the API
    const fetchMissionNames = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/missionscards");
            const missionData = await response.json();
            // Map mission IDs to their names for quick lookup
            return missionData.reduce((acc, mission) => {
                acc[mission.mission_id] = mission.name;
                return acc;
            }, {});
        } catch (error) {
            console.error("Error fetching mission names:", error);
            return {}; // Return empty object if fetch fails
        }
    };

    // Main function to fetch user data, completed bytes, and criteria, then trigger achievement logic
    const fetchUserDataAndBytes = async () => {
        try {
            // Fetch user data
            const userResponse = await fetch(`http://localhost:3000/api/user_bytes_cards?user_id=${userId}`);
            const userData = await userResponse.json();
            if (userData.length > 0 && userData[0].first_name) {
                setUserName(userData[0].first_name); // Set user's first name
                console.log("Fetched user name:", userData[0].first_name);
            }

            // Fetch completed bytes
            const completedBytesResponse = await fetch(`http://localhost:3000/api/user_completed_bytes?user_id=${userId}`);
            const completedBytes = await completedBytesResponse.json();
            console.log("Fetched completed bytes data:", completedBytes);

            // Fetch mission criteria
            const criteriaResponse = await fetch(`http://localhost:3000/api/criteria/all`);
            const criteriaData = await criteriaResponse.json();
            console.log("Fetched criteria data:", criteriaData);

            // Group criteria by mission for easy access
            const groupedCriteria = groupCriteriaByMission(criteriaData);

            // Check if there are any new completed bytes since the last check
            const storedCompletedBytes = JSON.parse(localStorage.getItem("completedBytes")) || [];
            const newCompletedBytes = completedBytes.filter(
                byte => !storedCompletedBytes.some(stored => stored.bite_id === byte.bite_id)
            );

            // Only proceed if there are newly completed bytes
            if (newCompletedBytes.length > 0) {
                console.log("Triggering popup for new completion:", newCompletedBytes[0]);

                // Calculate newly unlocked missions based on criteria and completed bytes
                const previouslyUnlockedMissions = JSON.parse(localStorage.getItem("previouslyUnlockedMissions")) || [];
                const newlyUnlockedMissions = determineUnlockedMissions(completedBytes, calculateTotalLP(completedBytes), groupedCriteria);

                // Filter for missions that are newly unlocked
                const justUnlockedMissions = newlyUnlockedMissions.filter(
                    mission => !previouslyUnlockedMissions.some(prevMission => prevMission.mission_id === mission.mission_id)
                );

                // Fetch mission names and attach to unlocked missions
                const missionNamesMap = await fetchMissionNames();
                const missionsWithNames = justUnlockedMissions.map(mission => ({
                    ...mission,
                    mission_name: missionNamesMap[mission.mission_id] || `Unnamed Mission ${mission.mission_id}`
                }));

                // Pass completed byte and unlocked missions with names to parent component
                onAchievement(newCompletedBytes[0], missionsWithNames, userData[0].first_name);

                // Store newly unlocked missions in localStorage for future reference
                localStorage.setItem("previouslyUnlockedMissions", JSON.stringify(newlyUnlockedMissions));
            } else {
                console.log("No new completions detected, no popup triggered.");
            }

            // Update completedBytes in localStorage to track progress
            localStorage.setItem("completedBytes", JSON.stringify(completedBytes));
        } catch (error) {
            console.error("Error fetching user details or completed bytes:", error);
        }
    };

    useEffect(() => {
        if (!userId) {
            console.log("User not logged in, skipping mission unlock logic.");
            return;
        }
        fetchUserDataAndBytes();
    }, [userId, onAchievement]);

    // Helper functions for calculating total learning points, grouping criteria, and determining unlocked missions remain unchanged

    const calculateTotalLP = (completedBytes) => {
        const lpData = {};
        completedBytes.forEach(byte => {
            lpData[byte.subcategory_id] = (lpData[byte.subcategory_id] || 0) + byte.lp_value;
        });
        return Object.entries(lpData).map(([subcategory_id, lp_total]) => ({ subcategory_id: parseInt(subcategory_id, 10), lp_total }));
    };

    const groupCriteriaByMission = (criteriaData) => {
        return criteriaData.reduce((acc, criterion) => {
            const missionId = criterion.mission_id;
            if (!acc[missionId]) acc[missionId] = [];
            acc[missionId].push(criterion);
            return acc;
        }, {});
    };

    const determineUnlockedMissions = (completedBytes, lpData, groupedCriteria) => {
        return Object.entries(groupedCriteria).filter(([missionId, criteria]) => {
            const andCriteria = criteria.filter(criterion => criterion.condition_type === "And" || criterion.condition_type === "None");
            const orCriteria = criteria.filter(criterion => criterion.condition_type === "Or");

            const andCriteriaMet = andCriteria.every(criterion => {
                if (criterion.criteria_type === "Bite Complete") {
                    return completedBytes.some(byte => byte.bite_id === criterion.bite_id);
                } else if (criterion.criteria_type === "LP Required") {
                    const userLp = lpData.find(lp => lp.subcategory_id === criterion.subcategory_id);
                    return userLp && userLp.lp_total >= criterion.lp_value;
                }
                return false;
            });

            const orCriteriaMet = orCriteria.length === 0 || orCriteria.some(criterion => {
                if (criterion.criteria_type === "Bite Complete") {
                    return completedBytes.some(byte => byte.bite_id === criterion.bite_id);
                } else if (criterion.criteria_type === "LP Required") {
                    const userLp = lpData.find(lp => lp.subcategory_id === criterion.subcategory_id);
                    return userLp && userLp.lp_total >= criterion.lp_value;
                }
                return false;
            });

            return andCriteriaMet && orCriteriaMet;
        }).map(([missionId]) => ({ mission_id: parseInt(missionId, 10) }));
    };

    return null;
};

export default AchievementLogic;



