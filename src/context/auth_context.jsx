import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// AuthProvider component wraps the application, providing user data and Zenler SSO token to other components
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks if the user is authenticated
    const [user, setUser] = useState(null); // Stores user data (e.g., ID, role)
    const [zenlerToken, setZenlerToken] = useState(null); // Stores the Zenler SSO token

    // useEffect to fetch session data from the backend on initial render
    useEffect(() => {
        fetch('http://localhost:3000/session/check-session', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                setIsAuthenticated(data.isAuthenticated); // Update auth state based on session data
                setUser(data.user || null); // Update user data
                setZenlerToken(data.zenlerToken || null); // Update Zenler SSO token if available
            })
            .catch(() => {
                setIsAuthenticated(false);
                setUser(null); // Reset user and token if session check fails
                setZenlerToken(null);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, zenlerToken }}>
            {children}
        </AuthContext.Provider>
    );
}

// useAuth custom hook to access authentication context in other components
export function useAuth() {
    return useContext(AuthContext);
}



