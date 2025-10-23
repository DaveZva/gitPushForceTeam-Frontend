import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true); // Pro kontrolu při prvním načtení

    useEffect(() => {
        // Při načtení aplikace zkusíme načíst data z localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            // Nastavíme token do hlavičky axios pro všechny budoucí požadavky
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const handleAuthResponse = (data) => {
        const { token, ...userData } = data;

        setUser(userData);
        setToken(token);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        handleAuthResponse(data);
    };

    const register = async (firstName, lastName, email, password) => {
        const data = await apiRegister({ firstName, lastName, email, password });
        handleAuthResponse(data);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    // Hodnota, kterou sdílíme celé aplikaci
    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};