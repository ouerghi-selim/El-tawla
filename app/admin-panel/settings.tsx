import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { logout } from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store';

export default function AdminSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    enableNewRegistrations: true,
    requireApproval: true,
    enableNotifications: true,
    maintenanceMode: false,
  });

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Settings</Text>
        <Text style={styles.subtitle}>Configure system-wide settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registration Settings</Text>
        
        <View style={styles.toggleGroup}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Enable New Registrations</Text>
            <Text style={styles.toggleDescription}>
              Allow new users and restaurants to register
            </Text>
          </View>
          <Switch
            value={settings.enableNewRegistrations}
            onValueChange={(value) => 
              setSettings(prev => ({ ...prev, enableNewRegistrations: value }))
            }
            trackColor={{ false: '#767577', true: '#E3735E' }}
            thumbColor={settings.enableNewRegistrations ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.toggleGroup}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Require Admin Approval</Text>
            <Text style={styles.toggleDescription}>
              New restaurant accounts require admin approval
            </Text>
          </View>
          <Switch
            value={settings.requireApproval}
            onValueChange={(value) => 
              setSettings(prev => ({ ...prev, requireApproval: value }))
            }
            trackColor={{ false: '#767577', true: '#E3735E' }}
            thumbColor={settings.requireApproval ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Settings</Text>

        <View style={styles.toggleGroup}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Enable Notifications</Text>
            <Text style={styles.toggleDescription}>
              Send system notifications to users and restaurants
            </Text>
          </View>
          <Switch
            value={settings.enableNotifications}
            onValueChange={(value) => 
              setSettings(prev => ({ ...prev, enableNotifications: value }))
            }
            trackColor={{ false: '#767577', true: '#E3735E' }}
            thumbColor={settings.enableNotifications ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.toggleGroup}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Maintenance Mode</Text>
            <Text style={styles.toggleDescription}>
              Put the application in maintenance mode
            </Text>
          </View>
          <Switch
            value={settings.maintenanceMode}
            onValueChange={(value) => 
              setSettings(prev => ({ ...prev, maintenanceMode: value }))
            }
            trackColor={{ false: '#767577', true: '#E3735E' }}
            thumbColor={settings.maintenanceMode ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        
        <Pressable style={styles.dangerButton}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.dangerButtonText}>Clear System Cache</Text>
        </Pressable>

        <Pressable style={styles.dangerButton}>
          <Ionicons name="refresh-outline" size={24} color="#fff" />
          <Text style={styles.dangerButtonText}>Reset All Settings</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#dc3545" />
          <Text style={styles.logoutText}>Déconnexion</Text>
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
});