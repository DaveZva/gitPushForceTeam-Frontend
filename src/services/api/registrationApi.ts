import { CatFormData } from '../../schemas/registrationSchema';

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
    id: number;
    name: string;
    date: string;
    location: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const registrationApi = {
    submitRegistration: async (registrationData: RegistrationPayload): Promise<SubmitRegistrationResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Prázdný objekt jako fallback
            throw new Error(errorData?.message || 'Chyba při odesílání registrace');
        }

        return await response.json() as SubmitRegistrationResponse;

    } catch (error) {
        console.error('API Error:', error);
        throw (error as Error);
    }
},

getAvailableShows: async (): Promise<AvailableShow[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/exhibitions/available`);
        if (!response.ok) {
            throw new Error('Chyba při načítání výstav');
        }

        return [
            { id: 1, name: 'MVK Praha', date: '14. - 15. 12. 2025', location: 'Praha' },
            { id: 2, name: 'MVK Ostrava', date: '20. - 21. 1. 2026', location: 'Ostrava' },
            { id: 3, name: 'MVK Brno', date: '5. - 6. 3. 2026', location: 'Brno' }
        ];

    } catch (error) {
        console.error('API Error:', error);
        return [
            { id: 1, name: 'MVK Praha', date: '14. - 15. 12. 2025', location: 'Praha' },
            { id: 2, name: 'MVK Ostrava', date: '20. - 21. 1. 2026', location: 'Ostrava' },
            { id: 3, name: 'MVK Brno', date: '5. - 6. 3. 2026', location: 'Brno' }
        ];
    }
}
};