import axios, { AxiosError } from 'axios';

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

interface ApiErrorData {
    message: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const handleAuthError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorData>;
        if (axiosError.response) {
            console.error("API Error Response:", axiosError.response.data);
            if (axiosError.response.status === 401 || axiosError.response.status === 403) {
                throw new Error('errors.invalidCredentials');
            }
            throw new Error(axiosError.response.data?.message || 'errors.serverError');
        } else if (axiosError.request) {
            console.error("API Network Error:", axiosError.request);
            throw new Error('errors.networkError');
        }
    }
    console.error("API Setup Error:", (error as Error).message);
    throw new Error((error as Error).message || 'errors.unknownError');
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw new Error('Unhandled login error');
    }
};

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw new Error('Unhandled register error');
    }
};

export const forgotPassword = async (email: string): Promise<void> => {
    try {
        await api.post('/auth/forgot-password', { email });
    } catch (error) {
        handleAuthError(error);
        throw new Error('Unhandled forgot password error');
    }
};

export const resetPasswordConfirm = async (token: string, newPassword: string): Promise<void> => {
    try {
        await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
        handleAuthError(error);
        throw new Error('errors.resetPasswordFailed');
    }
};

export default api;