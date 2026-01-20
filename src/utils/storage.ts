import { RegistrationFormData, CatFormData } from '../schemas/registrationSchema';

interface BasePerson {
    firstName: string;
    lastName: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    email: string;
    phone: string;
}

type PartialPerson = Partial<BasePerson>;

interface SavedMetadata {
    id: number;
    createdAt: string;
}

export const enum StorageKeys {
    OWNERS = 'cat_show_owners',
    BREEDERS = 'cat_show_breeders',
    CATS = 'cat_show_cats',
    CURRENT_FORM = 'cat_registration_current'
}

export const storageUtils = {
    saveOwner: (ownerData: BasePerson): void => {
        const owners = storageUtils.getOwners();
        const exists = owners.find(b => b.email === ownerData.email);

        if (!exists) {
            owners.push({
                id: Date.now(),
                ...ownerData,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(StorageKeys.OWNERS, JSON.stringify(owners));
        }
    },

    getOwners: (): (SavedMetadata & BasePerson)[] => {
        const data = localStorage.getItem(StorageKeys.OWNERS);
        return data ? JSON.parse(data) as (SavedMetadata & BasePerson)[] : [];
    },

    saveBreeder: (breederData: PartialPerson): void => {
        if (!breederData.email) {
            return;
        }

        const breeders = storageUtils.getBreeders();
        const exists = breeders.find(e => e.email === breederData.email);

        if (!exists) {
            breeders.push({
                id: Date.now(),
                ...breederData,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(StorageKeys.BREEDERS, JSON.stringify(breeders));
        }
    },

    getBreeders: (): (SavedMetadata & PartialPerson)[] => {
        const data = localStorage.getItem(StorageKeys.BREEDERS);
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