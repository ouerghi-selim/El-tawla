import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../utils/i18n/LanguageContext';

const LanguageSelector = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.language')}</Text>
      <View style={styles.languageOptions}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              currentLanguage === language.code && styles.activeLanguage
            ]}
            onPress={() => changeLanguage(language.code)}
          >
            <Text
              style={[
                styles.languageText,
                currentLanguage === language.code && styles.activeLanguageText
              ]}
            >
              {language.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 100,
    alignItems: 'center',
  },
  activeLanguage: {
    backgroundColor: '#4CAF50', // Green color matching TheFork's brand
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  activeLanguageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LanguageSelector;
