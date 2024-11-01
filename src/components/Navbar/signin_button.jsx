import React, { useState, useEffect } from "react";

function SigninButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Effect to check if the user is currently logged in by calling the backend session check
    useEffect(() => {
        fetch('http://localhost:3000/session/check-session', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                setIsLoggedIn(data.isAuthenticated); // Update login state based on response
                console.log("User is authenticated:", data.isAuthenticated); // Log for debugging
            })
            .catch((error) => console.error("Session check failed:", error));
    }, []);

    // Handle button click for signing in or signing out
    const handleClick = () => {
        if (isLoggedIn) {
            // Log the user out by calling the backend logout route
            fetch('http://localhost:3000/session/logout', { method: 'POST', credentials: 'include' })
                .then(() => {
                    setIsLoggedIn(false); // Update state to reflect logged-out status
                    console.log("User logged out successfully"); // Log for debugging
                    // Redirect to home page after logout
                    window.location.href = 'http://localhost:5173/bytes';
                })
                .catch((error) => console.error("Logout failed:", error));
        } else {
            // Redirect to the sign-in (register) page
            window.location.href = 'http://localhost:5173/register'; // Redirect for sign-in
        }
    };

    return (
        <button type="button" className="navbar__sign-in-btn" onClick={handleClick}>
            {isLoggedIn ? "Log Out" : "Sign In"}
        </button>
    );
}

export default SigninButton;


