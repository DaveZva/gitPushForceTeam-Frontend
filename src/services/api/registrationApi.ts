import { CatFormData } from '../../schemas/registrationSchema';
import api from '../api';

export interface RegistrationPayload {
    show: {
        id: string;
        days: 'sat' | 'sun' | 'both';
    };
    cats: CatFormData[];
    owner: {
        firstName: string;
        lastName: string;
        address: string;
        zip: string;
        city: string;
        email: string;
        phone: string;
        localOrganization: string;
        membershipNumber: string;
    };
    breeder: {
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

export interface PublicCatalogEntry {
    id: number;
    entryNumber: number;
    name: string;
    ems: string;
    sex: string;
    birthDate: string;
    registrationNumber: string;
    father: string;
    mother: string;
    ownerName: string;
    breederName: string;
    breederCountry: string;
    category: string;
    color: string;
    className: string;
    group: number | null;
}

export interface SavedCat {
    id: number;
    catName: string;
    titleBefore?: string;
    titleAfter?: string;
    emsCode: string;
    pedigreeNumber: string;
    chipNumber: string;
    birthDate: string;
    gender: string;

    fatherName?: string;
    fatherTitleBefore?: string;
    fatherTitleAfter?: string;
    fatherEmsCode?: string;
    fatherBirthDate?: string;
    fatherChipNumber?: string;
    fatherPedigreeNumber?: string;

    motherName?: string;
    motherTitleBefore?: string;
    motherTitleAfter?: string;
    motherEmsCode?: string;
    motherBirthDate?: string;
    motherChipNumber?: string;
    motherPedigreeNumber?: string;
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

export interface RegistrationDetail {
    id: number;
    registrationNumber: string;
    status: 'PLANNED' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
    amountPaid?: number;
    showName?: string;
}

export interface QuickCatalogEntry {
    catalogNumber: number;
    catName: string;
    gender: 'MALE' | 'FEMALE';
    emsCode: string;
    showClass: string;
    category: number;
}

export interface PublicShowDetail {
    id: number;
    name: string;
    description: string;
    venueName: string;
    venueCity: string;
    organizerName: string;
    organizerWebsiteUrl: string;
    startDate: string;
    endDate: string;
    vetCheckStart: string;
    judgingStart: string;
    judgingEnd: string;
    maxCats: number;
    occupiedSpots: number;
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
            const response = await api.get<AvailableShow[]>('/shows/available');
            return response.data;
        } catch (error) {
            console.error('API Error (getAvailableShows):', error);
            return [];
        }
    },

    getMyCats: async (): Promise<SavedCat[]> => {
        const response = await api.get<SavedCat[]>('/cats/my');
        return response.data;
    },

    getRegisteredCatIdsForShow: async (showId: string): Promise<number[]> => {
        const response = await api.get<number[]>(`/cats/registered-in-show/${showId}`);
        return response.data;
    },

    getCatalog: async (showId: string | number): Promise<PublicCatalogEntry[]> => {
        try {
            const response = await api.get<PublicCatalogEntry[]>(`/shows/${showId}/catalog`);
            return response.data;
        } catch (error) {
            console.error('API Error (getCatalog):', error);
            throw error;
        }
    },

    getShowInfo: async (showId: string | number): Promise<PublicShowDetail> => {
        const response = await api.get<PublicShowDetail>(`/shows/${showId}/details`);
        return response.data;
    },

    getQuickCatalog: async (showId: string | number): Promise<QuickCatalogEntry[]> => {
        const response = await api.get<QuickCatalogEntry[]>(`/shows/${showId}/quick-catalog`);
        return response.data;
    }
};

export const getRegistrationDetail = async (id: number | string): Promise<RegistrationDetail> => {
    const response = await api.get<RegistrationDetail>(`/registrations/${id}`);
    return response.data;
};