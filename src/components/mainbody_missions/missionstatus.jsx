import React from 'react';

/**
 * MissionStatus displays the criteria required to unlock a mission.
 * It checks which criteria have been met and which have not, showing a tick or cross for each.
 * 
 * @param {Object} mission - The locked mission that is being evaluated.
 * @param {Array} criteria - The criteria required to unlock the mission.
 * @param {Array} userBytes - The user's progress, showing completed bytes and LP.
 */
const MissionStatus = ({ mission, criteria = [], userBytes = [] }) => {
    // Helper function to check if a criterion has been met
    const isCriterionMet = (criterion) => {
        if (criterion.criteria_type === 'Bite Complete') {
            // Safeguard userBytes to ensure it's an array
            if (!userBytes || !Array.isArray(userBytes)) {
                console.warn('userBytes is undefined or not an array');
                return false;  // Return false if userBytes is not available
            }

            const hasCompletedBite = userBytes.some(
                (byte) => byte.bite_id === criterion.bite_id && byte.completion_date !== null
            );
            return hasCompletedBite;
        }
        return false;
    };

    if (!mission || !criteria || criteria.length === 0) {
        console.warn('No mission or criteria available');
        return <div>No criteria available for this mission.</div>;
    }

    return (
        <div className="missions_criteria_container">
            <h2>{mission.name}</h2>
            <p className="missions_criteria_H">This mission is locked. Here is what you need to unlock it:</p>

            <ul className="missions_criteria_display">
                {criteria.map((criterion) => {
                    const criterionMet = isCriterionMet(criterion);

                    return (
                        <li key={criterion.criteria_id}>
                            {criterion.criteria_type === 'Bite Complete' ? (
                                <span>Complete Bite: {criterion.bite_name}</span>
                            ) : (
                                <span>Earn {criterion.lp_value} LP in Subcategory: {criterion.subcategory_name}</span>
                            )}

                            {criterionMet ? (
                                <span style={{ color: 'green', marginLeft: '10px' }}>✓</span>
                            ) : (
                                <span style={{ color: 'red', marginLeft: '10px' }}>✗</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MissionStatus;

