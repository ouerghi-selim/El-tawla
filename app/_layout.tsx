import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import { LanguageProvider } from '../utils/i18n/LanguageContext';
import '../utils/i18n/i18n';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="restaurant" />
          <Stack.Screen name="settings" />
        </Stack>
      </LanguageProvider>
    </Provider>
  );
}
