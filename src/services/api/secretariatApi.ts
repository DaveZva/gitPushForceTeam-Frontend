import api from '../api';
import { ShowFormData } from '../../schemas/showSchema';
import { TFunction } from 'i18next';
import axios, { AxiosError } from 'axios';
import {AvailableShow} from "@/services/api/registrationApi";

export interface Show {
    id: number | string;
    name: string;
    description?: string;
    status: 'PLANNED' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED';
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
}

interface ApiErrorData {
    message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
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
    getSecretariatShows: async (): Promise<Show[]> => {
        try {
            const response = await api.get<Show[]>(SECRETARIAT_URL);
            return response.data; // Axios vrací data v .data
        } catch (error) {
            handleError(error, "xx" as any);
            throw error;
        }
    },

    createShow: async (showData: ShowFormData): Promise<Show> => {
        try {
            const response = await api.post<Show>(SECRETARIAT_URL, showData);
            return response.data;
        } catch (error) {
            handleError(error, "xx" as any);
            throw error;
        }
    },

    getAvailableShows: async (): Promise<AvailableShow[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/exhibitions/available`);

            if (!response.ok) {
                throw new Error(`Chyba při načítání výstav: ${response.status} ${response.statusText}`);
            }

            const data: AvailableShow[] = await response.json();

            return data;

        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    getShowById: async (showId: string | number): Promise<Show> => {
        try {
            const response = await api.get<Show>(`${SECRETARIAT_URL}/${showId}`);
            return response.data;
        } catch (error) {
            handleError(error, "xx" as any);
            throw error;
        }
    },

    updateShow: async (showId: string | number, showData: ShowFormData): Promise<Show> => {
        try {
            const response = await api.put<Show>(`${SECRETARIAT_URL}/${showId}`, showData);
            return response.data;
        } catch (error) {
            handleError(error, "xx" as any);
            throw error;
        }
    },

    deleteShow: async (showId: string | number): Promise<void> => {
        try {
            await api.delete(`${SECRETARIAT_URL}/${showId}`);
            return;
        } catch (error) {
            handleError(error, "xx" as any);
            throw error;
        }
    }
};