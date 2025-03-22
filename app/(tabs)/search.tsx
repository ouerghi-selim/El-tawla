import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

import { searchRestaurants, getLocalSpecialties } from '../utils/restaurantService';
import RestaurantCard from '../components/RestaurantCard';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [priceLevel, setPriceLevel] = useState(0);
  const [features, setFeatures] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);
  const [localSpecialties, setLocalSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(true);
  
  useEffect(() => {
    loadLocalSpecialties();
  }, []);
  
  const loadLocalSpecialties = async () => {
    try {
      setIsLoadingSpecialties(true);
      const specialties = await getLocalSpecialties();
      setLocalSpecialties(specialties);
    } catch (error) {
      console.error('Error loading local specialties:', error);
    } finally {
      setIsLoadingSpecialties(false);
    }
  };
  
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const params = {
        query: searchQuery,
        city,
        cuisineType,
        priceLevel: priceLevel > 0 ? priceLevel : undefined,
        features: features.length > 0 ? features : undefined,
        sortBy
      };
      
      const searchResults = await searchRestaurants(params);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleFeature = (feature) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
    Haptics.selectionAsync();
  };
  
  const handleSpecialtySelect = (specialty) => {
    setCuisineType(specialty.name);
    setShowFilters(true);
    Haptics.selectionAsync();
  };
  
  const handleRestaurantSelect = (restaurant) => {
    navigation.navigate('RestaurantDetails', { restaurantId: restaurant.id });
  };
  
  const renderSpecialtyItem = ({ item }) => (
    <Pressable
      style={styles.specialtyItem}
      onPress={() => handleSpecialtySelect(item)}
    >
      <Text style={styles.specialtyName}>{item.name}</Text>
      <Text style={styles.specialtyCount}>{item.count} restaurants</Text>
    </Pressable>
  );
  
  const renderResultItem = ({ item }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => handleRestaurantSelect(item)}
    />
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher un restaurant, une cuisine..."
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>
        
        <Pressable
          style={styles.filterButton}
          onPress={() => {
            setShowFilters(!showFilters);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Ionicons
            name={showFilters ? "options" : "options-outline"}
            size={24}
            color={showFilters ? "#E3735E" : "#666"}
          />
        </Pressable>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Ville</Text>
              <TextInput
                style={styles.filterInput}
                value={city}
                onChangeText={setCity}
                placeholder="Tunis, Sfax, Sousse..."
              />
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Cuisine</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={cuisineType}
                  onValueChange={(value) => setCuisineType(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Toutes les cuisines" value="" />
                  <Picker.Item label="Tunisienne" value="Tunisienne" />
                  <Picker.Item label="Méditerranéenne" value="Méditerranéenne" />
                  <Picker.Item label="Française" value="Française" />
                  <Picker.Item label="Italienne" value="Italienne" />
                  <Picker.Item label="Fruits de mer" value="Fruits de mer" />
                  <Picker.Item label="Végétarienne" value="Végétarienne" />
                </Picker>
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Prix</Text>
              <View style={styles.priceContainer}>
                <Pressable
                  style={[
                    styles.priceButton,
                    priceLevel === 1 && styles.activePriceButton
                  ]}
                  onPress={() => {
                    setPriceLevel(priceLevel === 1 ? 0 : 1);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[
                    styles.priceButtonText,
                    priceLevel === 1 && styles.activePriceButtonText
                  ]}>€</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.priceButton,
                    priceLevel === 2 && styles.activePriceButton
                  ]}
                  onPress={() => {
                    setPriceLevel(priceLevel === 2 ? 0 : 2);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[
                    styles.priceButtonText,
                    priceLevel === 2 && styles.activePriceButtonText
                  ]}>€€</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.priceButton,
                    priceLevel === 3 && styles.activePriceButton
                  ]}
                  onPress={() => {
                    setPriceLevel(priceLevel === 3 ? 0 : 3);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[
                    styles.priceButtonText,
                    priceLevel === 3 && styles.activePriceButtonText
                  ]}>€€€</Text>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Caractéristiques</Text>
              <View style={styles.featuresContainer}>
                <Pressable
                  style={[
                    styles.featureButton,
                    features.includes('has_wifi') && styles.activeFeatureButton
                  ]}
                  onPress={() => toggleFeature('has_wifi')}
                >
                  <Ionicons
                    name="wifi-outline"
                    size={16}
                    color={features.includes('has_wifi') ? "#fff" : "#666"}
                  />
                  <Text style={[
                    styles.featureButtonText,
                    features.includes('has_wifi') && styles.activeFeatureButtonText
                  ]}>Wi-Fi</Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.featureButton,
                    features.includes('has_parking') && styles.activeFeatureButton
                  ]}
                  onPress={() => toggleFeature('has_parking')}
                >
                  <Ionicons
                    name="car-outline"
                    size={16}
                    color={features.includes('has_parking') ? "#fff" : "#666"}
                  />
                  <Text style={[
                    styles.featureButtonText,
                    features.includes('has_parking') && styles.activeFeatureButtonText
                  ]}>Parking</Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.featureButton,
                    features.includes('has_outdoor_seating') && styles.activeFeatureButton
                  ]}
                  onPress={() => toggleFeature('has_outdoor_seating')}
                >
                  <Ionicons
                    name="sunny-outline"
                    size={16}
                    color={features.includes('has_outdoor_seating') ? "#fff" : "#666"}
                  />
                  <Text style={[
                    styles.featureButtonText,
                    features.includes('has_outdoor_seating') && styles.activeFeatureButtonText
                  ]}>Terrasse</Text>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Trier par</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Pertinence" value="relevance" />
                  <Picker.Item label="Note" value="rating" />
                  <Picker.Item label="Distance" value="distance" />
                </Picker>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.filterActions}>
            <Pressable
              style={styles.resetButton}
              onPress={() => {
                setCity('');
                setCuisineType('');
                setPriceLevel(0);
                setFeatures([]);
                setSortBy('relevance');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </Pressable>
            
            <Pressable
              style={styles.applyButton}
              onPress={handleSearch}
            >
              <Text style={styles.applyButtonText}>Appliquer</Text>
            </Pressable>
          </View>
        </View>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E3735E" />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.specialtiesSection}>
            <Text style={styles.sectionTitle}>Spécialités tunisiennes populaires</Text>
            
            {isLoadingSpecialties ? (
              <ActivityIndicator size="small" color="#E3735E" style={styles.specialtiesLoading} />
            ) : (
              <FlatList
                data={localSpecialties}
                renderItem={renderSpecialtyItem}
                keyExtractor={(item) => item.name}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.specialtiesList}
              />
            )}
          </View>
          
          <View style={styles.searchTipsSection}>
            <Text style={styles.sectionTitle}>Conseils de recherche</Text>
            <View style={styles.tipCard}>
              <Ionicons name="restaurant-outline" size={24} color="#E3735E" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Découvrez la cuisine locale</Text>
                <Text style={styles.tipText}>
                  Essayez les spécialités tunisiennes comme le couscous, le brik ou la ojja.
                </Text>
              </View>
            </View>
            
            <View style={styles.tipCard}>
              <Ionicons name="time-outline" size={24} color="#E3735E" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Réservez à l'avance</Text>
                <Text style={styles.tipText}>
                  Les restaurants populaires sont souvent complets, surtout le week-end.
                </Text>
              </View>
            </View>
            
            <View style={styles.tipCard}>
              <Ionicons name="star-outline" size={24} color="#E3735E" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Consultez les avis</Text>
                <Text style={styles.tipText}>
                  Les avis des autres utilisateurs peuvent vous aider à faire le bon choix.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  filtersScroll: {
    paddingHorizontal: 16,
  },
  filterSection: {
    marginRight: 24,
    minWidth: 150,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minWidth: 150,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    width: 200,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  priceButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  activePriceButton: {
    backgroundColor: '#E3735E',
  },
  priceButtonText: {
    fontSize: 16,
    color: '#666',
  },
  activePriceButtonText: {
    color: '#fff',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFeatureButton: {
    backgroundColor: '#E3735E',
  },
  featureButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activeFeatureButtonText: {
    color: '#fff',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#666',
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E3735E',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  resultsList: {
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  specialtiesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  specialtiesLoading: {
    marginVertical: 20,
  },
  specialtiesList: {
    paddingRight: 16,
  },
  specialtyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  specialtyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  specialtyCount: {
    fontSize: 14,
    color: '#666',
  },
  searchTipsSection: {
    marginBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default SearchScreen;
