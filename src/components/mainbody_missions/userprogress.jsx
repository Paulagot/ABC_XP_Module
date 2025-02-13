import React, { useState } from "react";
import ConfettiBoom from "react-confetti-boom";


// Helper function to log session status
const logSessionStatus = (zenlerLoggedIn) => {};

function UserProgressStatus({ mission }) {
    const [showConfetti, setShowConfetti] = useState(false); // Track confetti rendering

    const handleMouseEnter = () => {
        // Only show confetti if the mission is complete
        if (mission.text === "Mission Complete") {
            setShowConfetti(true);
        }
    };

    const handleMouseLeave = () => {
        // Hide confetti when the hover ends
        setShowConfetti(false);
    };

    const handleStatusClick = async () => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const zenlerLoggedIn = sessionStorage.getItem("zenlerLoggedIn");

        logSessionStatus(zenlerLoggedIn);

        if (mission.text === "Explore Mission") {
            if (mission.landing_page_url) {
                window.location.href = mission.landing_page_url;
            } else {
                console.warn("[UserProgressStatus] Landing page URL missing for mission:", mission.name);
            }
            return;
        }

        if (!zenlerLoggedIn) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/sso`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseUrl: mission.mission_url, type: "mission" }),
                    credentials: "include",
                });

                if (response.ok) {
                    const { ssoUrl } = await response.json();
                    sessionStorage.setItem("zenlerLoggedIn", "true");
                    window.location.href = ssoUrl;
                } else {
                    console.error("[UserProgressStatus] SSO token generation failed:", await response.json());
                }
            } catch (error) {
                console.error("[UserProgressStatus] Error during SSO token generation:", error);
            }
        } else {
            window.location.href = mission.mission_url;
        }
    };

    // Define dynamic inline styles based on `mission.text`
    const cardStyle = (() => {
        if (mission.text === "Mission Complete") {
            return { boxShadow: "10px 10px 25px rgba(255, 215, 0, 0.6)" };
        }
        if (mission.text === "Continue Mission") {
            return { boxShadow: "10px 10px 15px #285c41" };
        }
        return { boxShadow: "10px 10px 15px rgb(229, 93, 93)" }; // Default to "Explore Mission"
    })();

    return (
        <div
            className="mission_card_container"
            style={cardStyle} // Apply the dynamic inline style
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="mission_card_content">
                {showConfetti && (
                    <div className="mission-confetti-container">
                        <ConfettiBoom
                            mode="boom"
                            particleCount={300}
                            spread={200}
                            duration={4500}
                            colors={["#f39c12", "#e74c3c", "#3498db", "#2ecc71"]}
                        />
                    </div>
                )}

                <p className="mission-description">{mission.subtitle}</p>

                {mission.sponsor_img && (
                    <div className="hover_sponsor">
                        <p>Thanks to our Sponsor</p>
                        <p>{mission.sponsor_name || "Unknown Sponsor"}</p>
                        <img src={mission.sponsor_img} className="hover_sponsor_logo" />
                    </div>
                )}

                <div
                    className="byte-user_status"
                    onClick={handleStatusClick}
                    style={{ cursor: "pointer" }}
                >
                    {mission.text}
                </div>
            </div>
        </div>
    );
}

export default UserProgressStatus;
