import { CatFormData } from '../../schemas/registrationSchema';
import api from '../api';

export interface RegistrationPayload {
    show: {
        id: string;
        days: 'sat' | 'sun' | 'both';
    };
    cats: CatFormData[];
    breeder: {
        firstName: string;
        lastName: string;
        address: string;
        zip: string;
        city: string;
        email: string;
        phone: string;
    };
    exhibitor: {
        firstName?: string;
        lastName?: string;
        address?: string;
        zip?: string;
        city?: string;
        email?: string;
        phone?: string;
    } | null;
    notes?: string;
    consents: {
        dataAccuracy: boolean;
        gdpr: boolean;
    };
}

export interface SubmitRegistrationResponse {
    registrationNumber: string | number;
}

export interface AvailableShow {
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

export const registrationApi = {
    submitRegistration: async (registrationData: RegistrationPayload): Promise<SubmitRegistrationResponse> => {
        try {
            const response = await api.post<SubmitRegistrationResponse>('/registrations', registrationData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw (error as Error);
        }
    },

    getAvailableShows: async (): Promise<AvailableShow[]> => {
        try {
            const response = await api.get<AvailableShow[]>('/exhibitions/available');
            return response.data;
        } catch (error) {
            console.error('API Error (getAvailableShows):', error);
            return [];
        }
    }
};