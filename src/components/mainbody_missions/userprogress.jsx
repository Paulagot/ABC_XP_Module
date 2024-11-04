import React, { useEffect, useState } from "react";

// Helper function to log session status
const logSessionStatus = (zenlerToken, zenlerLoggedIn) => {
    console.log("Zenler Token:", zenlerToken);
    console.log("Zenler Logged In (sessionStorage):", zenlerLoggedIn);
};

function UserProgressStatus({ mission }) {
    const [zenlerToken, setZenlerToken] = useState(null);

    useEffect(() => {
        // Clear sessionStorage to avoid stale login state on each new session
        if (!sessionStorage.getItem("zenlerLoggedIn")) {
            sessionStorage.removeItem("zenlerLoggedIn");
        }

        const fetchSessionData = async () => {
            try {
                const response = await fetch("http://localhost:3000/session/check-session");
                console.log("Session response status:", response.status);
                if (!response.ok) throw new Error("Failed to fetch session data.");

                const data = await response.json();
                console.log("Session data received:", data);

                if (data.isAuthenticated && data.zenlerToken) {
                    setZenlerToken(data.zenlerToken);
                    logSessionStatus(data.zenlerToken, sessionStorage.getItem("zenlerLoggedIn"));
                } else {
                    console.warn("Zenler token not available in session data.");
                }
            } catch (error) {
                console.error("Error fetching session data:", error);
            }
        };

        fetchSessionData();
    }, []);

    const handleStatusClick = () => {
        const zenlerLoggedIn = sessionStorage.getItem("zenlerLoggedIn");

        // Log session status for debugging
        logSessionStatus(zenlerToken, zenlerLoggedIn);

        if (mission.mission_url) {
            if (!zenlerLoggedIn && zenlerToken) {
                console.log("User not logged into Zenler. Redirecting to SSO endpoint.");

                const errorUrl = "https://www.ablockofcrypto.com/blog";
                const ssoUrl = `https://ABlockofCrypto.newzenler.com/api/sso/v1?token=${zenlerToken}&return_to=${encodeURIComponent(mission.mission_url)}&error_url=${encodeURIComponent(errorUrl)}`;
                
                console.log("Constructed SSO URL:", ssoUrl);
                window.open(ssoUrl, "_blank"); // Open the SSO link in a new tab for testing

                // Set Zenler login state in sessionStorage after first redirect
                sessionStorage.setItem("zenlerLoggedIn", "true");
            } else if (zenlerLoggedIn) {
                console.log("Session indicates user already logged into Zenler; redirecting directly to mission.");
                window.open(mission.mission_url, "_blank"); // Directly open mission URL if already logged in
            } else {
                console.warn("Zenler token missing or undefined. Cannot perform SSO.");
            }
        } else {
            console.warn("Mission URL missing. Cannot redirect to mission.");
        }
    };

    return (
        <div className="mission_card_container">
            <div className="mission_card_content">
                <p className="mission-description">{mission.subtitle}</p>

                {mission.sponsor_img && (
                    <div className="hover_sponsor">
                        <p>Thanks to our Sponsor</p>
                        <p>{mission.sponsor_name || "Unknown Sponsor"}</p>
                        <img src={mission.sponsor_img} className="hover_sponsor_logo" />
                    </div>
                )}

                <div
                    className={`byte-user_status ${mission.className}`}
                    onClick={handleStatusClick}
                    style={{ cursor: 'pointer' }}
                >
                    {mission.text}
                </div>
            </div>
        </div>
    );
}

export default UserProgressStatus;









