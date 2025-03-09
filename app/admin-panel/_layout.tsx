import { Stack } from 'expo-router';
import { useColorScheme, View, Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { RootState } from '../../store';

export default function AdminPanelLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Redirect non-admin users
    if (user && user.type !== 'admin') {
      router.replace('/');
    } else if (!user) {
      router.replace('/auth/login');
    }
  }, [user]);

  if (!user || user.type !== 'admin') {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
          },
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          headerShadowVisible: false,
        }}>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Admin Dashboard',
            headerTitleStyle: {
              color: '#E3735E',
              fontSize: 20,
              fontWeight: '600',
            }
          }} 
        />
        <Stack.Screen 
          name="restaurants" 
          options={{ 
            title: 'Restaurants',
            headerTitleStyle: {
              color: '#4CAF50',
              fontSize: 20,
              fontWeight: '600',
            }
          }} 
        />
        <Stack.Screen 
          name="users" 
          options={{ 
            title: 'Users',
            headerTitleStyle: {
              color: '#2196F3',
              fontSize: 20,
              fontWeight: '600',
            }
          }} 
        />
        <Stack.Screen 
          name="reservations" 
          options={{ 
            title: 'Reservations',
            headerTitleStyle: {
              color: '#FF9800',
              fontSize: 20,
              fontWeight: '600',
            }
          }} 
        />
        <Stack.Screen 
          name="statistics" 
          options={{ 
            title: 'Statistics',
            headerTitleStyle: {
              color: '#9C27B0',
              fontSize: 20,
              fontWeight: '600',
            }
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
            headerTitleStyle: {
              color: '#607D8B',
              fontSize: 20,
              fontWeight: '600',
            }
          }} 
        />
      </Stack>

      {/* Floating Action Button for Statistics */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/admin-panel/statistics')}
      >
        <View style={styles.fabContent}>
          <Ionicons name="stats-chart" size={24} color="#fff" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#9C27B0',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});