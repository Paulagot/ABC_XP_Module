import React, { useState, useEffect } from "react";

function SigninButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const APP_URL = import.meta.env.VITE_APP_URL; // Vite environment variable


    // Effect to check if the user is currently logged in by calling the backend session check
    useEffect(() => {
        fetch(`${API_BASE_URL}/session/check-session`, { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                setIsLoggedIn(data.isAuthenticated); // Update login state based on response
               
            })
            .catch((error) => console.error("Session check failed:", error));
    }, []);

    // Handle button click for signing in or signing out
    const handleClick = () => {
        if (isLoggedIn) {
            // Log the user out by calling the backend logout route
            fetch(`${API_BASE_URL}/session/logout`, { method: 'POST', credentials: 'include' })
                .then(() => {
                    setIsLoggedIn(false); // Update state to reflect logged-out status
                   
                    // Redirect to home page after logout
                    window.location.href = `${APP_URL}/bytes`;
                })
                .catch((error) => console.error("Logout failed:", error));
        } else {
            // Redirect to the sign-in (register) page
            window.location.href = `${APP_URL}/register`;// Redirect for sign-in
        }
    };

    return (
        <button type="button" className="navbar__sign-in-btn" onClick={handleClick}>
            {isLoggedIn ? "Log Out" : "Sign In"}
        </button>
    );
}

export default SigninButton;


