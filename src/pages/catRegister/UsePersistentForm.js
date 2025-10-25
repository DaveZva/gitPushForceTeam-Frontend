import { useState, useEffect } from 'react';

//Funkce která se stará o logiku ukládání

function loadFromStorage(key, initialData) {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialData;
    } catch (error) {
        console.warn(`Chyba při načítání ${key} z localStorage`, error);
        return initialData;
    }
}

export function usePersistentForm(key, initialData) {
    const [data, setData] = useState(() => loadFromStorage(key, initialData));

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn(`Chyba při ukládání ${key} do localStorage`, error);
        }
    }, [key, data]);

    return [data, setData];
}