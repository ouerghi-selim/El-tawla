import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { RootState } from '../../store';

export default function FavoritesScreen() {
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const restaurants = useSelector((state: RootState) => 
    state.restaurants.restaurants.filter(r => favorites.includes(r.id))
  );

  const handleRestaurantPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart" size={64} color="#E3735E" />
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptySubtitle}>
          Start adding restaurants to your favorites to see them here
        </Text>
        <Pressable
          style={styles.exploreButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.exploreButtonText}>Explore Restaurants</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Favorites</Text>
        <Text style={styles.subtitle}>
          {favorites.length} restaurant{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.restaurantList}>
        {restaurants.map((restaurant) => (
          <Pressable
            key={restaurant.id}
            style={styles.restaurantCard}
            onPress={() => handleRestaurantPress(restaurant.id)}
          >
            <Image
              source={{ uri: `${restaurant.image}?w=400` }}
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantDetails}>
                {restaurant.cuisine} • {restaurant.rating}★
              </Text>
              <Text style={styles.restaurantPrice}>
                Average price: {restaurant.priceRange}
              </Text>
            </View>
          </Pressable>
        ))}
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
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#E3735E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  restaurantList: {
    padding: 20,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  restaurantDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  restaurantPrice: {
    fontSize: 14,
    color: '#E3735E',
    marginTop: 5,
  },
});