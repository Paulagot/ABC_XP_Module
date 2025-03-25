import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [zenlerToken, setZenlerToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;




    const refreshSession = async () => {
        try {
            console.log('Refreshing session...');
            const response = await fetch(`${API_BASE_URL}/session/check-session`, {
                credentials: 'include',
            });
            
            console.log('Session response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Session data:', data);
                setIsAuthenticated(data.isAuthenticated);
                setUser(data.user || null);
                setZenlerToken(data.zenlerToken || null);
                return data;
            } else {
                console.log('Session check failed');
                setIsAuthenticated(false);
                setUser(null);
                setZenlerToken(null);
                return null;
            }
        } catch (err) {
            console.error('Session refresh error:', err);
            setError(err.message);
            setIsAuthenticated(false);
            setUser(null);
            setZenlerToken(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            // After successful login, refresh the session to get all necessary data
            await refreshSession();
            return data;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            setIsAuthenticated(false);
            setUser(null);
            setZenlerToken(null);
        } catch (err) {
            console.error('Logout error:', err);
            setError(err.message);
        }
    };

    // Check session status on mount
    useEffect(() => {
        refreshSession();
    }, []);

    const value = {
        user,
        zenlerToken,
        loading,
        error,
        login,
        logout,
        refreshSession,
        isAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};





