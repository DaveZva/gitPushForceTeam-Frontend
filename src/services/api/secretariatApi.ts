import api from '../api';
import { ShowFormData } from '../../schemas/showSchema';
import { TFunction } from 'i18next';
import axios, { AxiosError } from 'axios';

export interface SecretariatShow {
    id: number | string;
    name: string;
    description?: string;
    status: 'PLANNED' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED';
    maxCats: number;
    vetCheckStart?: string;
    judgingStart?: string;
    judgingEnd?: string;
    venueName: string;
    venueAddress?: string;
    venueCity?: string;
    venueState?: string;
    venueZip?: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    organizerName: string;
    contactEmail?: string;
    websiteUrl?: string;
    totalRegistrations?: number;
    confirmedRegistrations?: number;
    totalCats?: number;
    judgesCount?: number;
}

export interface SecretariatStats {
    totalCats: number;
    confirmedCats: number;
    totalUsers: number;
    totalRevenue: number;
}

export interface SecretariatEntryDetail {
    entryId: number;
    catId: number;
    catName: string;
    emsCode: string;
    gender: string;
    birthDate: string;
    pedigreeNumber: string;
    chipNumber: string;
    showClass: string;
    catalogNumber?: string;
}

interface ApiErrorData {
    message: string;
}

const SECRETARIAT_URL = '/secretariat/shows';

const handleError = (error: unknown, t?: TFunction) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorData>;
        if (axiosError.response) {
            if (axiosError.response.status === 401 || axiosError.response.status === 403) {
                throw new Error('errors.unauthorized');
            }
            throw new Error(axiosError.response.data?.message || (t ? t('errors.serverError') : 'errors.serverError'));
        } else if (axiosError.request) {
            throw new Error(t ? t('errors.networkError') : 'errors.networkError');
        }
    }
    throw new Error((error as Error).message || 'errors.unknownError');
};

export const secretariatApi = {
    getSecretariatShows: async (): Promise<SecretariatShow[]> => {
        try {
            const response = await api.get<SecretariatShow[]>(SECRETARIAT_URL);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    createShow: async (showData: ShowFormData): Promise<SecretariatShow> => {
        try {
            const response = await api.post<SecretariatShow>(SECRETARIAT_URL, showData);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    getShowById: async (showId: string | number): Promise<SecretariatShow> => {
        try {
            const response = await api.get<SecretariatShow>(`${SECRETARIAT_URL}/${showId}`);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    updateShow: async (showId: string | number, showData: ShowFormData): Promise<SecretariatShow> => {
        try {
            const response = await api.put<SecretariatShow>(`${SECRETARIAT_URL}/${showId}`, showData);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    deleteShow: async (showId: string | number): Promise<void> => {
        try {
            await api.delete(`${SECRETARIAT_URL}/${showId}`);
            return;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    generateCatalog: async (showId: number | string): Promise<{ message: string; totalCats: number }> => {
        try {
            const response = await api.post<{ message: string; totalCats: number }>(`${SECRETARIAT_URL}/${showId}/generate-catalog`);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    getGlobalStats: async (): Promise<SecretariatStats> => {
        const response = await api.get<SecretariatStats>('/secretariat/shows/stats');
        return response.data;
    },

    getRegistrationsByShow: async (showId: string | number): Promise<any[]> => {
        const response = await api.get(`/secretariat/shows/${showId}/registrations`);
        return response.data;
    },

    getAllJudges: async (): Promise<any[]> => {
        const response = await api.get('/secretariat/judges');
        return response.data;
    },

    assignJudgeToShow: async (showId: string | number, judgeId: number): Promise<void> => {
        await api.post(`${SECRETARIAT_URL}/${showId}/judges`, { judgeId });
    },

    removeJudgeFromShow: async (showId: string | number, judgeId: number): Promise<void> => {
        await api.delete(`${SECRETARIAT_URL}/${showId}/judges/${judgeId}`);
    },

    getEntryDetail: async (entryId: number): Promise<SecretariatEntryDetail> => {
        const response = await api.get(`${SECRETARIAT_URL}/entries/${entryId}`);
        return response.data;
    },

    updateEntry: async (entryId: number, data: SecretariatEntryDetail): Promise<void> => {
        await api.put(`${SECRETARIAT_URL}/entries/${entryId}`, data);
    }
};