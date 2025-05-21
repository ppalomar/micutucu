import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones
import enTranslations from './locales/en/translation.json';
import esTranslations from './locales/es/translation.json';

// Configuración de i18n
i18n
  // Detección del idioma del navegador
  .use(LanguageDetector)
  // Pasar la instancia de i18n a react-i18next
  .use(initReactI18next)
  // Opciones de inicialización
  .init({
    debug: false,
    fallbackLng: 'es', // Idioma por defecto
    interpolation: {
      escapeValue: false, // No necesitamos escapar valores en React
    },
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: esTranslations,
      },
    },
  });

export default i18n;
