import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Image, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { openMapsWithAddress } from '../../components/Map';
import type { RootState } from '../../store';

interface FilterOptions {
  cuisine: string[];
  priceRange: string[];
  rating: number | null;
  features: string[];
  dietary: string[];
  atmosphere: string[];
  sortBy: string | null;
}

export default function SearchScreen() {
  const router = useRouter();
  const [isFilterMode, setIsFilterMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cuisine: [],
    priceRange: [],
    rating: null,
    features: [],
    dietary: [],
    atmosphere: [],
    sortBy: null,
  });

  const restaurants = useSelector((state: RootState) => state.restaurants.restaurants) || [];

  const filterCategories = {
    cuisine: {
      title: 'Cuisine',
      icon: 'restaurant',
      options: [
        { label: 'Tunisian', icon: 'restaurant-outline', value: 'Tunisian' },
        { label: 'Mediterranean', icon: 'fish-outline', value: 'Mediterranean' },
        { label: 'Seafood', icon: 'water-outline', value: 'Seafood' },
        { label: 'International', icon: 'globe-outline', value: 'International' },
        { label: 'Traditional', icon: 'home-outline', value: 'Traditional' },
      ],
    },
    priceRange: {
      title: 'Price Range',
      icon: 'wallet',
      options: [
        { label: 'Budget', icon: 'cash-outline', value: '₪' },
        { label: 'Moderate', icon: 'card-outline', value: '₪₪' },
        { label: 'Expensive', icon: 'diamond-outline', value: '₪₪₪' },
        { label: 'Luxury', icon: 'sparkles-outline', value: '₪₪₪₪' },
      ],
    },
    features: {
      title: 'Features',
      icon: 'apps',
      options: [
        { label: 'Outdoor Seating', icon: 'sunny-outline', value: 'Outdoor Seating' },
        { label: 'Private Rooms', icon: 'key-outline', value: 'Private Rooms' },
        { label: 'Live Music', icon: 'musical-notes-outline', value: 'Live Music' },
        { label: 'Waterfront View', icon: 'water-outline', value: 'Waterfront View' },
        { label: 'Rooftop', icon: 'business-outline', value: 'Rooftop' },
      ],
    },
    dietary: {
      title: 'Dietary',
      icon: 'leaf',
      options: [
        { label: 'Vegetarian Friendly', icon: 'leaf-outline', value: 'Vegetarian Friendly' },
        { label: 'Vegan Options', icon: 'nutrition-outline', value: 'Vegan Options' },
        { label: 'Gluten Free', icon: 'wheat-outline', value: 'Gluten Free' },
        { label: 'Halal', icon: 'moon-outline', value: 'Halal' },
      ],
    },
    atmosphere: {
      title: 'Atmosphere',
      icon: 'moon',
      options: [
        { label: 'Casual Dining', icon: 'cafe-outline', value: 'Casual Dining' },
        { label: 'Fine Dining', icon: 'wine-outline', value: 'Fine Dining' },
        { label: 'Family Friendly', icon: 'people-outline', value: 'Family Friendly' },
        { label: 'Romantic', icon: 'heart-outline', value: 'Romantic' },
        { label: 'Business Casual', icon: 'briefcase-outline', value: 'Business Casual' },
      ],
    },
  };

  const sortOptions = [
    { id: 'rating', label: 'Highest Rated', icon: 'star' },
    { id: 'price-low', label: 'Price: Low to High', icon: 'trending-down' },
    { id: 'price-high', label: 'Price: High to Low', icon: 'trending-up' },
    { id: 'distance', label: 'Nearest to Me', icon: 'location' },
  ];

  const toggleFilter = (category: keyof FilterOptions, value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [category]: prev[category]?.includes(value)
        ? prev[category].filter(v => v !== value)
        : [...(prev[category] || []), value],
    }));
  };

  const setRating = (rating: string) => {
    const numRating = parseFloat(rating);
    setFilterOptions(prev => ({
      ...prev,
      rating: prev.rating === numRating ? null : numRating,
    }));
  };

  const setSortBy = (sort: string | null) => {
    setFilterOptions(prev => ({
      ...prev,
      sortBy: prev.sortBy === sort ? null : sort,
    }));
  };

  const clearFilters = () => {
    setFilterOptions({
      cuisine: [],
      priceRange: [],
      rating: null,
      features: [],
      dietary: [],
      atmosphere: [],
      sortBy: null,
    });
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    return Object.values(filterOptions).flat().filter(Boolean).length;
  };

  const applyFilters = () => {
    setIsFilterMode(false);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filterOptions.cuisine.length && !filterOptions.cuisine.some(c => 
      restaurant.cuisine.toLowerCase().includes(c.toLowerCase())
    )) {
      return false;
    }

    if (filterOptions.priceRange.length && !filterOptions.priceRange.includes(restaurant.priceRange)) {
      return false;
    }

    if (filterOptions.rating && restaurant.rating < filterOptions.rating) {
      return false;
    }

    return true;
  });

  const renderFilterSection = (category: keyof typeof filterCategories) => {
    const { title, icon, options } = filterCategories[category];
    
    return (
      <View key={category} style={styles.filterSection}>
        <View style={styles.filterSectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Ionicons name={icon as any} size={24} color="#fff" />
          </View>
          <Text style={styles.filterSectionTitle}>{title}</Text>
        </View>
        <View style={styles.filterOptionsGrid}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.filterOption,
                (filterOptions[category] || []).includes(option.value) && styles.filterOptionActive
              ]}
              onPress={() => toggleFilter(category, option.value)}
            >
              <View style={styles.filterOptionContent}>
                <View style={[
                  styles.optionIconContainer,
                  (filterOptions[category] || []).includes(option.value) && styles.optionIconContainerActive
                ]}>
                  <Ionicons
                    name={option.icon as any}
                    size={18}
                    color={(filterOptions[category] || []).includes(option.value) ? '#fff' : '#666'}
                  />
                </View>
                <Text style={[
                  styles.filterOptionText,
                  (filterOptions[category] || []).includes(option.value) && styles.filterOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {(searchQuery || getActiveFiltersCount() > 0) && (
            <Pressable onPress={clearFilters}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </Pressable>
          )}
        </View>
        <Pressable
          style={styles.filterToggle}
          onPress={() => setIsFilterMode(!isFilterMode)}
        >
          <Ionicons name="options" size={24} color="#E3735E" />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {isFilterMode ? (
        <ScrollView style={styles.filterContainer}>
          {Object.keys(filterCategories).map((category) => (
            renderFilterSection(category as keyof typeof filterCategories)
          ))}
          
          <View style={styles.filterSection}>
            <View style={styles.filterSectionHeader}>
              <Ionicons name="funnel" size={24} color="#E3735E" />
              <Text style={styles.filterSectionTitle}>Sort By</Text>
            </View>
            <View style={styles.sortOptions}>
              {sortOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.sortOption,
                    filterOptions.sortBy === option.id && styles.sortOptionActive
                  ]}
                  onPress={() => setSortBy(option.id)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={filterOptions.sortBy === option.id ? '#fff' : '#666'}
                  />
                  <Text style={[
                    styles.sortOptionText,
                    filterOptions.sortBy === option.id && styles.sortOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>
              Show {filteredRestaurants.length} Restaurants
            </Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {filteredRestaurants.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#E3735E" />
              <Text style={styles.emptyStateTitle}>No restaurants found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your filters or search criteria
              </Text>
            </View>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <Pressable
                key={restaurant.id}
                style={styles.restaurantCard}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              >
                <Image
                  source={{ uri: `${restaurant.image}?w=400` }}
                  style={styles.restaurantImage}
                />
                <View style={styles.restaurantInfo}>
                  <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
                  <Text style={styles.priceText}>{restaurant.priceRange}</Text>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      openMapsWithAddress(restaurant.address);
                    }}
                    style={styles.addressContainer}
                  >
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.addressText}>{restaurant.address}</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterToggle: {
    position: 'relative',
    padding: 8,
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#E3735E',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#1a1a1a',
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -5,
  },
  sectionIconContainer: {
    backgroundColor: '#E3735E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    backgroundColor: '#f8f9fa',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  optionIconContainerActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterOption: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterOptionActive: {
    backgroundColor: '#E3735E',
    borderColor: '#E3735E',
  },
  filterOptionText: {
    color: '#666',
    fontSize: 14,
  },
  filterOptionTextActive: {
    color: '#fff',
  },
  sortOptions: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionActive: {
    backgroundColor: '#E3735E',
  },
  sortOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  sortOptionTextActive: {
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#E3735E',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
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
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  cuisineText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    color: '#E3735E',
    fontWeight: '500',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
});