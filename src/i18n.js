import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'kn', 'te', 'ta', 'hi'], // Make sure 'ta' is included
    fallbackLng: 'en',
    debug: true,
    backend: {
      loadPath: '/src/locales/{{lng}}/translation.json',
    },
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;