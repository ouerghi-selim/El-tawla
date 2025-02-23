import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Pressable, View, Text } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E3735E',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#8E8E93' : '#999999',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitle: ({ children }) => (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: '600',
              color: '#E3735E',
              marginBottom: 2
            }}>
              El Tawla
            </Text>
            {children && (
              <Text style={{ 
                fontSize: 14, 
                color: '#666',
              }}>
                {children}
              </Text>
            )}
          </View>
        ),
        headerLeft: () => (
          <Pressable
            onPress={() => router.push('/')}
            style={{ 
              padding: 10,
              marginLeft: 10,
            }}
          >
            <Ionicons name="home-outline" size={24} color="#1a1a1a" />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/profile')}
            style={{ 
              padding: 10,
              marginRight: 10,
            }}
          >
            <Ionicons name="person-circle-outline" size={28} color="#1a1a1a" />
          </Pressable>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: 'Reservations',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}