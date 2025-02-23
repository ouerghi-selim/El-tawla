import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { fetchRestaurants } from '../../store/slices/restaurantSlice';
import Map from '../../components/Map';
import type { AppDispatch, RootState } from '../../store';

type FilterCategory = 'cuisine' | 'price' | 'rating';

interface Filter {
  category: FilterCategory;
  value: string;
  label: string;
}

const availableFilters: Filter[] = [
  { category: 'cuisine', value: 'tunisian', label: 'Tunisian' },
  { category: 'cuisine', value: 'mediterranean', label: 'Mediterranean' },
  { category: 'cuisine', value: 'seafood', label: 'Seafood' },
  { category: 'price', value: '₪', label: 'Budget' },
  { category: 'price', value: '₪₪', label: 'Moderate' },
  { category: 'price', value: '₪₪₪', label: 'Expensive' },
  { category: 'rating', value: '4', label: '4+ Stars' },
  { category: 'rating', value: '4.5', label: '4.5+ Stars' },
];

export default function DiscoverScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { featured, status } = useSelector((state: RootState) => state.restaurants);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

  useEffect(() => {
    dispatch(fetchRestaurants());
    
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    })();
  }, []);

  const handleRestaurantPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  const initialRegion = {
    latitude: 36.7992,
    longitude: 10.1802,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const toggleFilter = (filter: Filter) => {
    setActiveFilters(prev => {
      const isActive = prev.some(f => f.value === filter.value);
      if (isActive) {
        return prev.filter(f => f.value !== filter.value);
      }
      return [...prev, filter];
    });
  };

  const filteredRestaurants = featured.filter(restaurant => {
    // First apply search query
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchLower) ||
      restaurant.cuisine.toLowerCase().includes(searchLower) ||
      restaurant.address.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Then apply active filters
    if (activeFilters.length === 0) return true;

    return activeFilters.every(filter => {
      switch (filter.category) {
        case 'cuisine':
          return restaurant.cuisine.toLowerCase().includes(filter.value);
        case 'price':
          return restaurant.priceRange.length === filter.value.length;
        case 'rating':
          return restaurant.rating >= parseFloat(filter.value);
        default:
          return true;
      }
    });
  });

  const mapMarkers = filteredRestaurants.map(restaurant => ({
    id: restaurant.id,
    coordinate: restaurant.coordinates,
    title: restaurant.name,
    description: restaurant.cuisine,
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Marhba bik! 👋</Text>
        <Text style={styles.subtitle}>Discover the best of El Tawla's cuisine</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisines, or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </Pressable>
        ) : null}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {availableFilters.map((filter) => {
          const isActive = activeFilters.some(f => f.value === filter.value);
          return (
            <Pressable
              key={filter.value}
              style={[styles.filterChip, isActive && styles.activeFilterChip]}
              onPress={() => toggleFilter(filter)}
            >
              {isActive && (
                <Ionicons name="checkmark" size={16} color="#fff" style={styles.filterIcon} />
              )}
              <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.mapToggleContainer}>
        <Pressable
          style={[styles.toggleButton, !showMap && styles.toggleButtonActive]}
          onPress={() => setShowMap(false)}
        >
          <Ionicons
            name="list"
            size={20}
            color={!showMap ? '#E3735E' : '#666'}
          />
          <Text style={[styles.toggleText, !showMap && styles.toggleTextActive]}>
            List
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleButton, showMap && styles.toggleButtonActive]}
          onPress={() => setShowMap(true)}
        >
          <Ionicons
            name="map"
            size={20}
            color={showMap ? '#E3735E' : '#666'}
          />
          <Text style={[styles.toggleText, showMap && styles.toggleTextActive]}>
            Map
          </Text>
        </Pressable>
      </View>

      {showMap ? (
        <View style={styles.mapContainer}>
          <Map
            markers={mapMarkers}
            userLocation={userLocation?.coords}
            initialRegion={initialRegion}
            onMarkerPress={handleRestaurantPress}
          />
        </View>
      ) : (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>
            {searchQuery || activeFilters.length > 0 ? 'Search Results' : 'Featured Restaurants'}
          </Text>
          {filteredRestaurants.length === 0 ? (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color="#666" />
              <Text style={styles.noResultsText}>No restaurants found</Text>
              <Text style={styles.noResultsSubtext}>
                Try adjusting your search criteria or filters
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredRestaurants.map((restaurant) => (
                <Pressable
                  key={restaurant.id}
                  style={styles.restaurantCard}
                  onPress={() => handleRestaurantPress(restaurant.id)}
                >
                  <Image
                    source={{ uri: `${restaurant.image}?w=500` }}
                    style={styles.restaurantImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                  >
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantInfo}>
                      {restaurant.cuisine} • {restaurant.rating}★ • {restaurant.priceRange}
                    </Text>
                    <View style={styles.locationInfo}>
                      <Ionicons name="location" size={16} color="#fff" />
                      <Text style={styles.locationText}>{restaurant.address}</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      <View style={styles.promotionsSection}>
        <Text style={styles.sectionTitle}>Special Offers</Text>
        <View style={styles.promotionCard}>
          <Text style={styles.promotionTitle}>Early Bird Special</Text>
          <Text style={styles.promotionDescription}>
            Get 20% off when you book before 6 PM
          </Text>
        </View>
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    marginBottom: 15,
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    color: '#1a1a1a',
  },
  filtersContainer: {
    marginBottom: 15,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilterChip: {
    backgroundColor: '#E3735E',
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  mapToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  toggleButtonActive: {
    backgroundColor: '#fff5f3',
  },
  toggleText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 16,
  },
  toggleTextActive: {
    color: '#E3735E',
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  featuredSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    paddingHorizontal: 20,
    color: '#1a1a1a',
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  restaurantCard: {
    width: 300,
    height: 200,
    marginLeft: 20,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: 15,
    justifyContent: 'flex-end',
  },
  restaurantName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantInfo: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  promotionsSection: {
    marginTop: 20,
    paddingBottom: 30,
  },
  promotionCard: {
    backgroundColor: '#E3735E',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  promotionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  promotionDescription: {
    color: '#fff',
    marginTop: 5,
  },
});