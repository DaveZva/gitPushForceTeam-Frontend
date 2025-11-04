const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const registrationApi = {
    // Odeslat registraci
    submitRegistration: async (registrationData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            if (!response.ok) {
                throw new Error('Chyba při odesílání registrace');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    getAvailableShows: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/exhibitions/available`);
            if (!response.ok) throw new Error('Chyba při načítání výstav');
            //return await response.json();
            return [
                { id: 1, name: 'MVK Praha', date: '14. - 15. 12. 2025', location: 'Praha' },
                { id: 2, name: 'MVK Ostrava', date: '20. - 21. 1. 2026', location: 'Ostrava' },
                { id: 3, name: 'MVK Brno', date: '5. - 6. 3. 2026', location: 'Brno' }
            ];
        } catch (error) {
            console.error('API Error:', error);
            // Fallback data
            return [
                { id: 1, name: 'MVK Praha', date: '14. - 15. 12. 2025', location: 'Praha' },
                { id: 2, name: 'MVK Ostrava', date: '20. - 21. 1. 2026', location: 'Ostrava' },
                { id: 3, name: 'MVK Brno', date: '5. - 6. 3. 2026', location: 'Brno' }
            ];
        }
    }
};