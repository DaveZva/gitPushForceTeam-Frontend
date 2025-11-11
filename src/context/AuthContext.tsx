import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { login as apiLogin, register as apiRegister } from '../services/api';


interface User {
    id: number | string;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState<boolean>(true); // Pro kontrolu při prvním načtení

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserJSON = localStorage.getItem('user');

        if (storedToken && storedUserJSON) {
            try {
                const storedUser = JSON.parse(storedUserJSON) as User;
                setUser(storedUser);
                setToken(storedToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const handleAuthResponse = (data: AuthResponse) => {
        const { token, user } = data;

        setUser(user);
        setToken(token);

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const login = async (email: string, password: string): Promise<void> => {
        const data = await apiLogin(email, password);
        handleAuthResponse(data);
    };

    const register = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
        const data = await apiRegister({ firstName, lastName, email, password });
        handleAuthResponse(data);
    };

    const logout = (): void => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    const value: AuthContextType = {
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

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};