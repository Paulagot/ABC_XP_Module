import React, { useEffect, useState } from "react";

const AchievementLogic = ({ userId, onAchievement }) => {
  const [userName, setUserName] = useState(""); // State to store the user's first name

  useEffect(() => {
    // Simulate a user ID for testing purposes
    if (!userId) {
      console.log("User not logged in, skipping mission unlock logic.");
      return;
    }

    const fetchUserDataAndBytes = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`http://localhost:3000/api/user_bytes_cards?user_id=${userId}`);
        const userData = await userResponse.json();

        if (userData.length > 0 && userData[0].first_name) {
          setUserName(userData[0].first_name);
          console.log("Fetched user name:", userData[0].first_name);
        }

        // Fetch completed bytes
        const bytesResponse = await fetch(`http://localhost:3000/api/user_completed_bytes?user_id=${userId}`);
        const completedBytes = await bytesResponse.json();
        console.log("Fetched completed bytes data:", completedBytes);

        // Calculate total LP per subcategory
        const lpData = calculateTotalLP(completedBytes);
        console.log("Calculated user LP data:", lpData);

        // Fetch all criteria
        const criteriaResponse = await fetch(`http://localhost:3000/api/criteria/all`);
        const criteriaData = await criteriaResponse.json();
        console.log("Fetched criteria data:", criteriaData);

        // Group criteria by mission_id
        const groupedCriteria = groupCriteriaByMission(criteriaData);
        console.log("Grouped criteria by mission:", groupedCriteria);

        // Determine all missions currently unlocked
        const initiallyUnlockedMissions = determineUnlockedMissions(completedBytes, lpData, groupedCriteria);
        console.log("Initially unlocked missions:", initiallyUnlockedMissions);

        // Store the initial unlocked missions in localStorage
        localStorage.setItem('initiallyUnlockedMissions', JSON.stringify(initiallyUnlockedMissions));
        console.log("initial unlocked missions saved to lockal:", initiallyUnlockedMissions);

        const storedCompletedBytes = JSON.parse(localStorage.getItem("completedBytes")) || [];
        let newCompletedBytes = [];

        if (storedCompletedBytes.length === 0) {
          newCompletedBytes = completedBytes;
        } else {
          newCompletedBytes = completedBytes.filter(
            (byte) =>
              !storedCompletedBytes.some((storedByte) => storedByte.bite_id === byte.bite_id)
          );
        }

        if (newCompletedBytes.length > 0) {
          console.log("Triggering popup for new completion:", newCompletedBytes[0]);
          // Determine newly unlocked missions after this byte completion
          const newlyUnlockedMissions = determineUnlockedMissions(newCompletedBytes, lpData, groupedCriteria);
          console.log("Newly unlocked missions:", newlyUnlockedMissions);

          // Compare to find missions unlocked by this specific byte completion
          const previouslyUnlockedMissions = JSON.parse(localStorage.getItem('initiallyUnlockedMissions')) || [];
          const justUnlockedMissions = newlyUnlockedMissions.filter(
            mission => !previouslyUnlockedMissions.some(prevMission => prevMission.mission_id === mission.mission_id)
          );

          console.log("Missions unlocked by the current byte completion:", justUnlockedMissions);

          onAchievement(newCompletedBytes[0], justUnlockedMissions, userData[0].first_name);
        } else {
          console.log("No new completions detected, no popup triggered.");
        }

        localStorage.setItem("completedBytes", JSON.stringify(completedBytes));
        console.log("Updated localStorage with new completed bytes:", completedBytes);
      } catch (error) {
        console.error("Error fetching user details or completed bytes:", error);
      }
    };

    fetchUserDataAndBytes();
  }, [userId, onAchievement]);

  // Function to calculate total LP for each subcategory
  const calculateTotalLP = (completedBytes) => {
    const lpData = {};

    completedBytes.forEach((byte) => {
      if (byte.subcategory_id) {
        lpData[byte.subcategory_id] = (lpData[byte.subcategory_id] || 0) + byte.lp_value;
      }
    });

    return Object.entries(lpData).map(([subcategory_id, lp_total]) => ({
      subcategory_id: parseInt(subcategory_id, 10),
      lp_total
    }));
  };

  // Function to group criteria by mission_id
  const groupCriteriaByMission = (criteriaData) => {
    return criteriaData.reduce((acc, criterion) => {
      const missionId = criterion.mission_id;
      if (!acc[missionId]) {
        acc[missionId] = [];
      }
      acc[missionId].push(criterion);
      return acc;
    }, {});
  };

  // Function to determine which missions are unlocked
  const determineUnlockedMissions = (completedBytes, lpData, groupedCriteria) => {
    return Object.entries(groupedCriteria).filter(([missionId, criteria]) => {
      // Separate criteria by condition type
      const andCriteria = criteria.filter((criterion) => criterion.condition_type === 'And' || criterion.condition_type === 'None');
      const orCriteria = criteria.filter((criterion) => criterion.condition_type === 'Or');

      // Check 'AND' criteria: all must be true
      const andCriteriaMet = andCriteria.every((criterion) => {
        if (criterion.criteria_type === 'Bite Complete') {
          return completedBytes.some((byte) => byte.bite_id === criterion.bite_id);
        } else if (criterion.criteria_type === 'LP Required') {
          const userLp = lpData.find((lp) => lp.subcategory_id === criterion.subcategory_id);
          return userLp && userLp.lp_total >= criterion.lp_value;
        }
        return false;
      });

      // Check 'OR' criteria: at least one must be true
      const orCriteriaMet = orCriteria.length === 0 || orCriteria.some((criterion) => {
        if (criterion.criteria_type === 'Bite Complete') {
          return completedBytes.some((byte) => byte.bite_id === criterion.bite_id);
        } else if (criterion.criteria_type === 'LP Required') {
          const userLp = lpData.find((lp) => lp.subcategory_id === criterion.subcategory_id);
          return userLp && userLp.lp_total >= criterion.lp_value;
        }
        return false;
      });

      // Mission is unlocked if all 'AND' criteria are met and at least one 'OR' criterion is met
      return andCriteriaMet && orCriteriaMet;
    }).map(([missionId]) => missionId); // Return the list of unlocked mission IDs
  };

  return null; // This component does not render anything
};

export default AchievementLogic;