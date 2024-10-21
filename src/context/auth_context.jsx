// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch session data from the backend
        fetch('http://localhost:3000/session/check-session', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                setIsAuthenticated(data.isAuthenticated);
                setUser(data.user || null);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setUser(null);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
