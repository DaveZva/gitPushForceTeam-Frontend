import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, forgotPassword as apiForgotPassword } from '../services/api';

interface User {
    id?: number | string;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthResponse {
    token: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
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
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken') || null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUserJSON = localStorage.getItem('user');

        if (storedToken && storedUserJSON) {
            try {
                const storedUser = JSON.parse(storedUserJSON) as User;
                setUser(storedUser);
                setToken(storedToken);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
            }
        }
        setLoading(false);
    }, []);

    const handleAuthResponse = (data: AuthResponse) => {
        const { token, firstName, lastName, email } = data;

        const userToStore: User = {
            firstName,
            lastName,
            email
        };

        setUser(userToStore);
        setToken(token);

        localStorage.setItem('user', JSON.stringify(userToStore));
        localStorage.setItem('authToken', token);
    };

    const login = async (email: string, password: string): Promise<void> => {
        const data = await apiLogin(email, password);
        handleAuthResponse(data);
    };

    const register = async (email: string, password: string): Promise<void> => {
        const data = await apiRegister({ email, password });
        handleAuthResponse(data);
    };

    const resetPassword = async (email: string): Promise<void> => {
        await apiForgotPassword(email);
    };

    const logout = (): void => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        resetPassword,
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