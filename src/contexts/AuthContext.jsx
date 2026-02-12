import React, { createContext, useState, useContext, useEffect } from 'react';
import airtableService from '../services/airtable';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState(null); // Airtable Record ID
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session
        const storedAuth = localStorage.getItem('trilogy_auth');
        const storedUser = localStorage.getItem('trilogy_user');
        const storedRole = localStorage.getItem('trilogy_role');
        const storedUserId = localStorage.getItem('trilogy_user_id');

        if (storedAuth === 'true') {
            setIsAuthenticated(true);
            if (storedUser) setUser(storedUser);
            if (storedRole) setRole(storedRole);
            if (storedUserId) setUserId(storedUserId);
        }
        setLoading(false);
    }, []);

    const login = async (name, password) => {
        const teamPassword = import.meta.env.VITE_TEAM_PASSWORD;
        // Normalize name for case-insensitive check, but store original input (or formatted version)
        const allowedNames = ['tomas', 'tomás', 'juan josé', 'juan jose'];
        const normalizedInput = name.toLowerCase().trim();

        if (password === teamPassword && allowedNames.includes(normalizedInput)) {
            // Capitalize first letter of each word for display
            const displayName = name.trim().replace(/\b\w/g, c => c.toUpperCase());

            setIsAuthenticated(true);
            setUser(displayName);
            localStorage.setItem('trilogy_auth', 'true');
            localStorage.setItem('trilogy_user', displayName);

            // Cloud Sync: Fetch or Create User in Airtable
            try {
                let cloudUser = await airtableService.fetchUserByName(displayName);

                if (cloudUser) {
                    // User exists, sync role
                    setRole(cloudUser.role || '');
                    setUserId(cloudUser.id);
                    localStorage.setItem('trilogy_role', cloudUser.role || '');
                    localStorage.setItem('trilogy_user_id', cloudUser.id);
                } else {
                    // New user, create in cloud
                    cloudUser = await airtableService.createUser(displayName, '');
                    setUserId(cloudUser.id);
                    setRole('');
                    localStorage.setItem('trilogy_user_id', cloudUser.id);
                    localStorage.setItem('trilogy_role', '');
                }
            } catch (error) {
                console.error("Failed to sync user with cloud:", error);
                // Fallback to local only if cloud fails, but logged in
            }

            return true;
        }
        return false;
    };

    const updateRole = async (newRole) => {
        setRole(newRole);
        localStorage.setItem('trilogy_role', newRole);

        if (userId) {
            await airtableService.updateUserRole(userId, newRole);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setRole('');
        setUserId(null);
        localStorage.removeItem('trilogy_auth');
        localStorage.removeItem('trilogy_user');
        localStorage.removeItem('trilogy_role');
        localStorage.removeItem('trilogy_user_id');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout, updateRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
