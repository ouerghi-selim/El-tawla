import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        {languages.map((language) => (
          <Pressable
            key={language.code}
            style={styles.languageItem}
            onPress={() => setSelectedLanguage(language.code)}
          >
            <Text style={styles.languageName}>{language.name}</Text>
            {selectedLanguage === language.code && (
              <Ionicons name="checkmark" size={24} color="#E3735E" />
            )}
          </Pressable>
        ))}
      </View>
      <Text style={styles.note}>
        Changing the language will restart the app
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageName: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});