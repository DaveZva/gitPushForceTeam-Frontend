import api from '../api'; // Importujeme naši centrální axios instanci

// Base URL pro sekretariát
const SECRETARIAT_URL = '/secretariat/exhibition';

/**
 * Zpracování chyb pro volání API
 * (Odlišné od Auth chyb, protože zde očekáváme 401/403)
 */
const handleError = (error, t) => {
    if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
            // AuthContext by měl toto zachytit a odhlásit uživatele
            // (viz úprava v AuthContext, která toto řeší globálně)
            throw new Error('errors.unauthorized');
        }
        throw new Error(error.response.data.message || (t ? t('errors.serverError') : 'errors.serverError'));
    } else if (error.request) {
        throw new Error(t ? t('errors.networkError') : 'errors.networkError');
    } else {
        throw new Error(error.message);
    }
};

export const secretariatApi = {
    /**
     * Získá všechny výstavy (použije token z 'api' instance)
     */
    getSecretariatShows: async () => {
        try {
            const response = await api.get(SECRETARIAT_URL);
            return response.data; // Axios vrací data v .data
        } catch (error) {
            throw new Error(handleError(error, "xx"));
        }
    },

    /**
     * Vytvoří novou výstavu
     */
    createShow: async (showData) => {
        try {
            const response = await api.post(SECRETARIAT_URL, showData);
            return response.data;
        } catch (error) {
            throw new Error(handleError(error, "xx"));
        }
    },

    /**
     * Získá jednu výstavu podle ID
     */
    getShowById: async (showId) => {
        try {
            const response = await api.get(`${SECRETARIAT_URL}/${showId}`);
            return response.data;
        } catch (error) {
            throw new Error(handleError(error, "xx"));
        }
    },

    /**
     * Aktualizuje výstavu
     */
    updateShow: async (showId, showData) => {
        try {
            const response = await api.put(`${SECRETARIAT_URL}/${showId}`, showData);
            return response.data;
        } catch (error) {
            throw new Error(handleError(error, "xx"));
        }
    },

    /**
     * Smaže výstavu
     */
    deleteShow: async (showId) => {
        try {
            const response = await api.delete(`${SECRETARIAT_URL}/${showId}`);
            return response.data; // Nebo response.status, pokud vrací 204
        } catch (error) {
            throw new Error(handleError(error, "xx"));
        }
    }
};
