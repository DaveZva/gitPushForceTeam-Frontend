import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationCS from './locales/cs/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
    cs: {
        translation: translationCS
    },
    en: {
        translation: translationEN
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'cs',
        fallbackLng: 'cs',

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;