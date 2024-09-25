import React from 'react';

/**
 * MissionUserActionStatus renders the appropriate action button for each unlocked mission.
 * @param {Object} mission - The unlocked mission object containing mission details.
 */
function MissionUserActionStatus({ mission }) {
    const getMissionStatusClass = () => {
        switch (mission.missionStatus) {
            
            case 'completed':
                return 'completed';  // Apply the 'completed' class for completed missions
            case 'in-progress':
                return 'in-progress'; // Apply the 'in-progress' class for ongoing missions
            case 'not-accepted':
            default:
                return 'not-accepted';  // Default to 'not-accepted' class
        }
    };
    console.log('missionstatus',mission.missionStatus)

    
    const renderActionButton = () => {
        switch (mission.missionStatus) {
            case 'completed':
                return <div className="mission_user_status completed">Mission Completed</div>;
            case 'in-progress':
                return <div className="mission_user_status">Continue Mission</div>;
            case 'not-accepted':
            default:
                return <div className="mission_user_status">Accept Mission</div>;
        }
    };

    return (
        <div className={`mission_card_content ${getMissionStatusClass()}`}>
            {renderActionButton()}
        </div>
    );
}

export default MissionUserActionStatus;
