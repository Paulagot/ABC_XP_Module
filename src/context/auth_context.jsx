import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [zenlerToken, setZenlerToken] = useState(null);
    const [authError, setAuthError] = useState(null);

    const checkSession = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/session/check-session', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(data.isAuthenticated);
                setUser(data.user || null);
                setZenlerToken(data.zenlerToken || null);
                setAuthError(null);
            } else {
                throw new Error('Session check failed');
            }
        } catch (error) {
            console.error('Error during session check:', error);
            setIsAuthenticated(false);
            setUser(null);
            setZenlerToken(null);
            setAuthError('Failed to verify session. Please try again.');
        }
    }, []);

    // Logout function that calls the session logout route to clear session data on both client and server
    const logout = async () => {
        try {
            const response = await fetch('http://localhost:3000/session/logout', { method: 'POST', credentials: 'include' });
            if (response.ok) {
                setIsAuthenticated(false); // Update local state to reflect logout
                setUser(null);
                setZenlerToken(null);
                localStorage.removeItem('auth'); // Optional: removes auth from storage to sync across tabs
            } else {
                throw new Error('Failed to log out');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'auth') {
                checkSession();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [checkSession]);

    const value = {
        isAuthenticated,
        user,
        zenlerToken,
        authError,
        logout, // Expose logout function in context
        refreshSession: checkSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}




