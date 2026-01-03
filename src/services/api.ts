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
    message?: string;
    error?: string;
}

interface PaymentIntentResponse {
    clientSecret: string;
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

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorData>) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 403) {
                const errorMsg = data?.error;

                if (errorMsg === 'Token expired' || errorMsg === 'Invalid token') {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/?expired=true';
                    return Promise.reject(new Error('errors.sessionExpired'));
                }
            }

            if (status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/';
                return Promise.reject(new Error('errors.unauthorized'));
            }
        }
        return Promise.reject(error);
    }
);

const handleAuthError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorData>;

        if (axiosError.response) {
            console.error("API Error Response:", axiosError.response.data);

            const serverMessage = axiosError.response.data?.message || axiosError.response.data?.error;
            throw new Error(serverMessage || 'errors.serverError');
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
        throw error;
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
        throw error;
    }
};

export const forgotPassword = async (email: string): Promise<void> => {
    try {
        await api.post('/auth/forgot-password', { email });
    } catch (error) {
        handleAuthError(error);
        throw error;
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

export const createPaymentIntent = async (registrationId: string | number): Promise<PaymentIntentResponse> => {
    try {
        const response = await api.post<PaymentIntentResponse>(`/payments/create-intent/${registrationId}`);
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
};

export default api;