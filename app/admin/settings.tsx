import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateScoreSettings } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';

export default function RestaurantSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [settings, setSettings] = useState({
    name: 'Le Baroque',
    description: 'Experience the finest Mediterranean and Tunisian cuisine in an elegant setting.',
    address: '15 Avenue Habib Bourguiba, Tunis',
    phone: '+216 71 123 456',
    email: 'contact@lebaroque.com',
    openingHours: '12:00 PM - 11:00 PM',
    maxCapacity: '50',
    autoConfirm: true,
    notifications: true,
    scoreEnabled: user?.score_enabled || false,
    scoreThreshold: user?.score_threshold?.toString() || '70',
  });

  const handleScoreSettingsUpdate = async () => {
    try {
      await dispatch(updateScoreSettings({
        threshold: parseInt(settings.scoreThreshold, 10),
        enabled: settings.scoreEnabled,
      })).unwrap();
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurant Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Restaurant Name</Text>
          <TextInput
            style={styles.input}
            value={settings.name}
            onChangeText={(text) => setSettings({ ...settings, name: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={settings.description}
            onChangeText={(text) => setSettings({ ...settings, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={settings.address}
            onChangeText={(text) => setSettings({ ...settings, address: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={settings.phone}
            onChangeText={(text) => setSettings({ ...settings, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={settings.email}
            onChangeText={(text) => setSettings({ ...settings, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operating Hours</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Opening Hours</Text>
          <TextInput
            style={styles.input}
            value={settings.openingHours}
            onChangeText={(text) => setSettings({ ...settings, openingHours: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Maximum Capacity</Text>
          <TextInput
            style={styles.input}
            value={settings.maxCapacity}
            onChangeText={(text) => setSettings({ ...settings, maxCapacity: text })}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reservation Settings</Text>

        <View style={styles.toggleGroup}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Auto-confirm Reservations</Text>
            <Text style={styles.toggleDescription}>
              Automatically confirm new reservations without manual approval
            </Text>
          </View>
          <Switch
            value={settings.autoConfirm}
            onValueChange={(value) => setSettings({ ...settings, autoConfirm: value })}
            trackColor={{ false: '#767577', true: '#E3735E' }}
            thumbColor={settings.autoConfirm ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.toggleGroup}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Push Notifications</Text>
            <Text style={styles.toggleDescription}>
              Receive notifications for new reservations and updates
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => setSettings({ ...settings, notifications: value })}
            trackColor={{ false: '#767577', true: '#E3735E' }}
            thumbColor={settings.notifications ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reservation Score Settings</Text>
        
        <View style={styles.toggleGroup}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Enable Score-Based Filtering</Text>
            <Text style={styles.toggleDescription}>
              Only allow reservations from customers with reliability scores above the threshold
            </Text>
          </View>
          <Switch
            value={settings.scoreEnabled}
            onValueChange={(value) => setSettings({ ...settings, scoreEnabled: value })}
            trackColor={{ false: '#767577', true: '#E3735E' }}
            thumbColor={settings.scoreEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {settings.scoreEnabled && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Minimum Score Threshold</Text>
            <TextInput
              style={styles.input}
              value={settings.scoreThreshold}
              onChangeText={(text) => setSettings({ ...settings, scoreThreshold: text })}
              keyboardType="number-pad"
              placeholder="Enter minimum score (0-100)"
            />
            <Text style={styles.helperText}>
              Customers with scores below this threshold will not be able to make reservations
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>About Customer Scores</Text>
            <Text style={styles.infoText}>
              • Scores range from 0 to 100{'\n'}
              • Higher scores indicate more reliable customers{'\n'}
              • Scores are affected by reservation history{'\n'}
              • Last-minute cancellations decrease scores significantly
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.saveButton}
          onPress={handleScoreSettingsUpdate}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  toggleGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 20,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#E3735E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff5f3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});