import { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    reservations: true,
    promotions: true,
    reminders: true,
    newsletter: false,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        {Object.entries(notifications).map(([key, value]) => (
          <View key={key} style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <Text style={styles.settingDescription}>
                Receive notifications about {key}
              </Text>
            </View>
            <Switch
              value={value}
              onValueChange={() => toggleSwitch(key as keyof typeof notifications)}
              trackColor={{ false: '#767577', true: '#E3735E' }}
              thumbColor={value ? '#fff' : '#f4f3f4'}
            />
          </View>
        ))}
      </View>
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});