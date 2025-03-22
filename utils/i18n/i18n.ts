// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importation des traductions
import fr from './translations/fr.json';
import ar from './translations/ar.json';
import en from './translations/en.json';

// Ressources de traduction
const resources = {
  fr: {
    translation: fr
  },
  ar: {
    translation: ar
  },
  en: {
    translation: en
  }
};

// Détection de la langue du système
const getDeviceLanguage = (): string => {
  const locale = Localization.locale;
  if (locale.startsWith('fr')) {
    return 'fr';
  } else if (locale.startsWith('ar')) {
    return 'ar';
  } else {
    return 'en';
  }
};

// Récupération de la langue sauvegardée
const getSavedLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem('userLanguage');
    return savedLanguage || getDeviceLanguage();
  } catch (error) {
    console.error('Error reading saved language:', error);
    return getDeviceLanguage();
  }
};

// Sauvegarde de la langue choisie
export const saveLanguage = async (language: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem('userLanguage', language);
    await i18n.changeLanguage(language);
    return true;
  } catch (error) {
    console.error('Error saving language:', error);
    return false;
  }
};

// Initialisation de i18next
const initI18n = async (): Promise<void> => {
  const savedLanguage = await getSavedLanguage();
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false
      }
    });
};

// Fonction pour changer la langue
export const changeLanguage = async (language: string): Promise<typeof i18n> => {
  await saveLanguage(language);
  return i18n.changeLanguage(language);
};

// Fonction pour obtenir la langue actuelle
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// Fonction pour vérifier si la langue actuelle est RTL
export const isRTL = (): boolean => {
  return i18n.language === 'ar';
};

// Initialisation
initI18n();

export default i18n;