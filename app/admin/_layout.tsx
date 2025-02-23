import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import type { RootState } from '../../store';

export default function AdminLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Redirect non-restaurant users
    if (user && user.type !== 'restaurant') {
      router.replace('/');
    } else if (!user) {
      router.replace('/auth/login');
    }
  }, [user]);

  if (!user || user.type !== 'restaurant') {
    return null;
  }
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
        },
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
      }}>
      <Stack.Screen name="index" options={{ title: 'Restaurant Dashboard' }} />
      <Stack.Screen name="menu" options={{ title: 'Menu Management' }} />
      <Stack.Screen name="reservations" options={{ title: 'Reservations' }} />
      <Stack.Screen name="settings" options={{ title: 'Restaurant Settings' }} />
    </Stack>
  );
}