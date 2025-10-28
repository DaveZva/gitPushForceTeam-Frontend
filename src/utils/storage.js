export const StorageKeys = {
    BREEDERS: 'cat_show_breeders',
    EXHIBITORS: 'cat_show_exhibitors',
    CATS: 'cat_show_cats',
    CURRENT_FORM: 'cat_registration_current'
};

export const storageUtils = {
    // Uložit chovatele
    saveBreeder: (breederData) => {
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

    // Načíst všechny chovatele
    getBreeders: () => {
        const data = localStorage.getItem(StorageKeys.BREEDERS);
        return data ? JSON.parse(data) : [];
    },

    // Uložit vystavovatele
    saveExhibitor: (exhibitorData) => {
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

    // Načíst všechny vystavovatele
    getExhibitors: () => {
        const data = localStorage.getItem(StorageKeys.EXHIBITORS);
        return data ? JSON.parse(data) : [];
    },

    // Uložit kočku
    saveCat: (catData) => {
        const cats = storageUtils.getCats();
        const exists = cats.find(c => c.pedigreeNumber === catData.pedigreeNumber);

        if (!exists) {
            cats.push({
                id: Date.now(),
                ...catData,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(StorageKeys.CATS, JSON.stringify(cats));
        }
    },

    // Načíst všechny kočky
    getCats: () => {
        const data = localStorage.getItem(StorageKeys.CATS);
        return data ? JSON.parse(data) : [];
    },

    // Uložit aktuální rozdělaný formulář
    saveCurrentForm: (formData) => {
        localStorage.setItem(StorageKeys.CURRENT_FORM, JSON.stringify(formData));
    },

    // Načíst aktuální formulář
    getCurrentForm: () => {
        const data = localStorage.getItem(StorageKeys.CURRENT_FORM);
        return data ? JSON.parse(data) : null;
    },

    // Smazat aktuální formulář
    clearCurrentForm: () => {
        localStorage.removeItem(StorageKeys.CURRENT_FORM);
    }
};