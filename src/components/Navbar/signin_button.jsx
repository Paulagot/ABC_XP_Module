import React, { useState, useEffect } from "react";

function SigninButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is logged in by calling the backend session check
    useEffect(() => {
        fetch('http://localhost:3000/session/check-session', { credentials: 'include' }) // Updated URL
            .then((res) => res.json())
            .then((data) => setIsLoggedIn(data.isAuthenticated))
            .catch((error) => console.error("Session check failed:", error));
    }, []);

    const handleClick = () => {
        if (isLoggedIn) {
            // Log the user out by calling the backend logout route
            fetch('http://localhost:3000/session/logout', { method: 'POST', credentials: 'include' }) // Updated URL
                .then(() => {
                    setIsLoggedIn(false);
                    // Redirect to home page after logout
                    window.location.href = 'https://www.ablockofcrypto.com'; // Redirect to home page after logout
                })
                .catch((error) => console.error("Logout failed:", error));
        } else {
            // Redirect to the sign-in (registar) page
            window.location.href = 'http://localhost:5173/registar'; // Updated sign-in route
        }
    };

    return (
        <button type="button" className="navbar__sign-in-btn" onClick={handleClick}>
            {isLoggedIn ? "Log Out" : "Sign In"}
        </button>
    );
}

export default SigninButton;

