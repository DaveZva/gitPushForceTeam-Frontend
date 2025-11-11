import { RegistrationFormData, CatFormData } from '../schemas/registrationSchema';

interface BasePerson {
    firstName: string;
    lastName: string;
    address: string;
    zip: string;
    city: string;
    email: string;
    phone: string;
}

type PartialPerson = Partial<BasePerson>;

interface SavedMetadata {
    id: number;
    createdAt: string;
}

export const enum StorageKeys {
    BREEDERS = 'cat_show_breeders',
    EXHIBITORS = 'cat_show_exhibitors',
    CATS = 'cat_show_cats',
    CURRENT_FORM = 'cat_registration_current'
}

export const storageUtils = {
    saveBreeder: (breederData: BasePerson): void => {
        const breeders = storageUtils.getBreeders();
        const exists = breeders.find(b => b.email === breederData.email);

        if (!exists) {
            breeders.push({
                id: Date.now(),
                ...breederData,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(StorageKeys.BREEDERS, JSON.stringify(breeders));
        }
    },

    getBreeders: (): (SavedMetadata & BasePerson)[] => {
        const data = localStorage.getItem(StorageKeys.BREEDERS);
        return data ? JSON.parse(data) as (SavedMetadata & BasePerson)[] : [];
    },

    saveExhibitor: (exhibitorData: PartialPerson): void => {
        if (!exhibitorData.email) {
            return;
        }

        const exhibitors = storageUtils.getExhibitors();
        const exists = exhibitors.find(e => e.email === exhibitorData.email);

        if (!exists) {
            exhibitors.push({
                id: Date.now(),
                ...exhibitorData,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(StorageKeys.EXHIBITORS, JSON.stringify(exhibitors));
        }
    },

    getExhibitors: (): (SavedMetadata & PartialPerson)[] => {
        const data = localStorage.getItem(StorageKeys.EXHIBITORS);
        return data ? JSON.parse(data) as (SavedMetadata & PartialPerson)[] : [];
    },

    saveCat: (catData: CatFormData): void => {
        const cats = storageUtils.getCats();
        const exists = cats.find(c => c.pedigreeNumber && c.pedigreeNumber === catData.pedigreeNumber);

        if (!exists) {
            cats.push({
                id: Date.now(),
                ...catData,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(StorageKeys.CATS, JSON.stringify(cats));
        }
    },

    getCats: (): (SavedMetadata & CatFormData)[] => {
        const data = localStorage.getItem(StorageKeys.CATS);
        return data ? JSON.parse(data) as (SavedMetadata & CatFormData)[] : [];
    },

    saveCurrentForm: (formData: RegistrationFormData): void => {
        localStorage.setItem(StorageKeys.CURRENT_FORM, JSON.stringify(formData));
    },

    getCurrentForm: (): RegistrationFormData | null => {
        const data = localStorage.getItem(StorageKeys.CURRENT_FORM);
        return data ? JSON.parse(data) as RegistrationFormData : null;
    },

    clearCurrentForm: (): void => {
        localStorage.removeItem(StorageKeys.CURRENT_FORM);
    }
};