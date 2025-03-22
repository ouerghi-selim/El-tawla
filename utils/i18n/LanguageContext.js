import React, { createContext, useState, useContext, useEffect } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage) {
          changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguagePreference();
  }, []);

  const changeLanguage = async (language) => {
    try {
      // Update i18n language
      await i18n.changeLanguage(language);
      
      // Update RTL setting based on language
      const rtl = language === 'ar';
      setIsRTL(rtl);
      I18nManager.forceRTL(rtl);
      
      // Save language preference
      await AsyncStorage.setItem('userLanguage', language);
      
      // Update state
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, isRTL, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
