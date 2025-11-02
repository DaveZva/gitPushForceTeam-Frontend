import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

/**
 * Vytvoření centrální instance axios
 */
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Zpracování chyb pro přihlášení/registraci
 */
const handleAuthError = (error) => {
    if (error.response) {
        console.error("API Error Response:", error.response.data);
        if (error.response.status === 401 || error.response.status === 403) {
            // Vracíme klíč pro překlad
            throw new Error('errors.invalidCredentials');
        }
        throw new Error(error.response.data.message || 'errors.serverError');
    } else if (error.request) {
        console.error("API Network Error:", error.request);
        throw new Error('errors.networkError');
    } else {
        console.error("API Setup Error:", error.message);
        throw new Error(error.message);
    }
};

/**
 * Volání pro přihlášení
 * POST /api/v1/auth/login
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data; // Vrací { token, user: {...} }
    } catch (error) {
        handleAuthError(error); // Předáme chybu dál
    }
};

/**
 * Volání pro registraci
 * POST /api/v1/auth/register
 */
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data; // Vrací { token, user: {...} }
    } catch (error) {
        handleAuthError(error); // Předáme chybu dál
    }
};

/**
 * Veřejné API pro registrační formulář
 */
export const registrationApi = {
    getAvailableShows: async () => {
        try {
            const response = await axios.get(`${API_URL}/exhibitions/available`);
            return response.data;
        } catch (error) {
            console.error('API Error (getAvailableShows):', error);
            return [];
        }
    },
    // submitRegistration: async (registrationData) => { ... }
};

export default api;

