import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function SettingsLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
        },
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
      }}>
      <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="language" options={{ title: 'Language' }} />
      <Stack.Screen name="help" options={{ title: 'Help & Support' }} />
    </Stack>
  );
}