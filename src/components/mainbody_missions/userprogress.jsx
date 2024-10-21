import React from "react";

function UserProgressStatus({ mission }) {
    /**
     * handleStatusClick: Handles the click event on the mission status.
     * This function redirects the user to the mission URL (if available).
     */
    const handleStatusClick = () => {
        if (mission.mission_url) {
            window.location.href = mission.mission_url;  // Redirect to the mission URL
        }
    };

    return (
        <div className="mission_card_container">
            <div className="mission_card_content">
                {/* Mission Subtitle */}
                <p className="mission-description">{mission.subtitle}</p>

                {/* Sponsor Section (name and image) */}
                {mission.sponsor_img && (
                    <div className="hover_sponsor">
                        <p>Thanks to our Sponsor</p><p> {mission.sponsor_name || "Unknown Sponsor"}</p>  {/* Display the sponsor's name */}
                        <img
                            src={mission.sponsor_img}
                            
                            className="hover_sponsor_logo"
                        />
                    </div>
                )}

                {/* Mission Status */}
                <div
                    className={`byte-user_status ${mission.className}`}  // Apply the correct class for the status
                    onClick={handleStatusClick}  // Redirect to mission_url when the status is clicked
                    style={{ cursor: 'pointer' }}  // Change cursor to pointer to indicate it's clickable
                >
                    {mission.text}  
                </div>
            </div>
        </div>
    );
}

export default UserProgressStatus;






