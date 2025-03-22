import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../utils/i18n/LanguageContext';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.settings')}</Text>
      <Text style={styles.description}>
        {t('common.loading')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default SettingsScreen;
