import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../utils/i18n/LanguageContext';

const LanguageIndicator = () => {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();

  const getLanguageName = () => {
    switch (currentLanguage) {
      case 'fr':
        return 'Français';
      case 'ar':
        return 'العربية';
      case 'en':
        return 'English';
      default:
        return 'Français';
    }
  };

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      <Text style={styles.label}>{t('profile.language')}:</Text>
      <Text style={styles.value}>{getLanguageName()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default LanguageIndicator;
