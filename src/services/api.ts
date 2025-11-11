import axios, { AxiosError } from 'axios';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthResponse {
    token: string;
    user: User;
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

interface AvailableShow {
    id: number;
    name: string;
    date: string;
}

export const registrationApi = {
    getAvailableShows: async (): Promise<AvailableShow[]> => {
        try {
            const response = await axios.get<AvailableShow[]>(`${API_URL}/exhibitions/available`);
            return response.data;
        } catch (error) {
            console.error('API Error (getAvailableShows):', error);
            return [];
        }
    },
};

export default api;