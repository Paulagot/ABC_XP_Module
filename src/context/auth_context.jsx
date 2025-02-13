import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [zenlerToken, setZenlerToken] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const checkSession = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/session/check-session`, {
                credentials: 'include', // Ensure cookies are sent
            });
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(data.isAuthenticated);
                setUser(data.user || null);
                setZenlerToken(data.zenlerToken || null);
                setAuthError(null);
                setLoading(false); // Ensure loading is updated
            } else {
                throw new Error('Session check failed');
            }
        } catch (error) {
            console.error('Error during session check:', error);
            setIsAuthenticated(false);
            setUser(null);
            setZenlerToken(null);
            setAuthError('Failed to verify session. Please try again.');
            setLoading(false); // Ensure loading is updated even on error
        }
    }, [API_BASE_URL]);

    const logout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/session/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                setIsAuthenticated(false);
                setUser(null);
                setZenlerToken(null);
                localStorage.removeItem('auth');
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
        loading, // Expose the loading state
        logout,
        refreshSession: checkSession,
        hasRole: (role) => user?.role === role, // Add this helper
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}





