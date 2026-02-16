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
    titleBefore?: string;
    catName: string;
    titleAfter?: string;
    emsCode: string;
    catGroup?: string;
    gender: string;
    birthDate: string;
    pedigreeNumber: string;
    chipNumber: string;
    showClass: string;
}

export interface SecretariatPayment {
    registrationId: number;
    registrationNumber: string;
    ownerName: string;
    ownerEmail: string;
    amount: number;
    status: 'PLANNED' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
    paymentMethod: string;
    paidAt?: string;
    createdAt: string;
    catCount: number;
}

export interface SecretariatJudge {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    validGroups: string[];
}

export interface BreedDistribution {
    code: string;
    name: string;
    count: number;
}

export interface JudgeWorkload {
    judgeId: number;
    judgeName: string;
    qualifications: string[];
    catsCount: number;
    breedDistribution: BreedDistribution[];
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

    // === Registrations & Entries ===
    getRegistrationsByShow: async (showId: string | number): Promise<any[]> => {
        const response = await api.get(`/secretariat/shows/${showId}/registrations`);
        return response.data;
    },

    getEntryDetail: async (entryId: number): Promise<SecretariatEntryDetail> => {
        const response = await api.get(`${SECRETARIAT_URL}/entries/${entryId}`);
        return response.data;
    },

    updateEntry: async (entryId: number, data: SecretariatEntryDetail): Promise<void> => {
        await api.put(`${SECRETARIAT_URL}/entries/${entryId}`, data);
    },

    getPaymentsByShow: async (showId: string | number): Promise<SecretariatPayment[]> => {
        try {
            const response = await api.get<SecretariatPayment[]>(`${SECRETARIAT_URL}/${showId}/payments`);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    confirmPayment: async (registrationId: number): Promise<void> => {
        try {
            await api.post(`${SECRETARIAT_URL}/payments/${registrationId}/confirm`);
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    getAllJudges: async (): Promise<SecretariatJudge[]> => {
        try {
            const response = await api.get<SecretariatJudge[]>(`${SECRETARIAT_URL}/judges`);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    createJudge: async (judge: Omit<SecretariatJudge, 'id'>): Promise<SecretariatJudge> => {
        try {
            const response = await api.post<SecretariatJudge>(`${SECRETARIAT_URL}/judges`, judge);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    getJudgesByShow: async (showId: string | number): Promise<SecretariatJudge[]> => {
        try {
            const response = await api.get<SecretariatJudge[]>(`${SECRETARIAT_URL}/${showId}/judges`);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    assignJudgeToShow: async (showId: string | number, judgeId: number): Promise<void> => {
        try {
            await api.post(`${SECRETARIAT_URL}/${showId}/judges`, { judgeId });
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    removeJudgeFromShow: async (showId: string | number, judgeId: number): Promise<void> => {
        try {
            await api.delete(`${SECRETARIAT_URL}/${showId}/judges/${judgeId}`);
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    getJudgeSheets: async (showId: string | number, judgeId: number, day: string): Promise<any[]> => {
        try {
            const response = await api.get(`${SECRETARIAT_URL}/${showId}/judging/judges/${judgeId}/sheets`, {
                params: { day }
            });
            return response.data;
        } catch (error) {
            return [];
        }
    },

    generateJudgingSheets: async (showId: string | number): Promise<void> => {
        try {
            await api.post(`${SECRETARIAT_URL}/${showId}/judging/generate`);
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    regenerateJudgeSheets: async (showId: string | number, judgeId: number): Promise<void> => {
        try {
            await api.post(`${SECRETARIAT_URL}/${showId}/judging/judges/${judgeId}/regenerate`);
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    getJudgingWorkload: async (showId: string | number, day: string): Promise<JudgeWorkload[]> => {
        try {
            const response = await api.get<JudgeWorkload[]>(`${SECRETARIAT_URL}/${showId}/judging/workload`, {
                params: { day }
            });
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    rebalanceWorkload: async (showId: string | number, day: string): Promise<void> => {
        try {
            await api.post(`${SECRETARIAT_URL}/${showId}/judging/rebalance`, null, {
                params: { day }
            });
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    downloadJudgeSheetsPdf: async (showId: string | number, judgeId: number, day: string): Promise<Blob> => {
        try {
            const response = await api.get(`${SECRETARIAT_URL}/${showId}/judging/judges/${judgeId}/sheets/pdf`, {
                params: { day },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    }
};