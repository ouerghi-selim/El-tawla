import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisines..."
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Popular Cuisines</Text>
        <View style={styles.cuisineGrid}>
          {['Tunisian', 'Mediterranean', 'Seafood', 'International'].map((cuisine) => (
            <View key={cuisine} style={styles.cuisineItem}>
              <Text style={styles.cuisineText}>{cuisine}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Popular Locations</Text>
        <View style={styles.locationList}>
          {['Tunis', 'Sousse', 'Sfax', 'Hammamet'].map((location) => (
            <View key={location} style={styles.locationItem}>
              <Ionicons name="location-outline" size={20} color="#E3735E" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    color: '#1a1a1a',
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  cuisineItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cuisineText: {
    fontSize: 16,
    color: '#333',
  },
  locationList: {
    paddingHorizontal: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});