import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RestaurantCard = ({ restaurant, onPress }) => {
  return (
    <Pressable 
      style={styles.container}
      onPress={onPress}
    >
      <Image 
        source={{ uri: restaurant.cover_image || 'https://via.placeholder.com/150' }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={
                  restaurant.average_rating >= star
                    ? 'star'
                    : restaurant.average_rating >= star - 0.5
                    ? 'star-half'
                    : 'star-outline'
                }
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
          <Text style={styles.ratingText}>
            {restaurant.average_rating.toFixed(1)}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.cuisineContainer}>
            {restaurant.cuisine_types && restaurant.cuisine_types.map((cuisine, index) => (
              <Text key={index} style={styles.cuisineText}>
                {index > 0 ? ' • ' : ''}{cuisine}
              </Text>
            ))}
          </View>
          
          <Text style={styles.priceText}>
            {'€'.repeat(restaurant.price_level)}
            <Text style={styles.priceTextInactive}>
              {'€'.repeat(3 - restaurant.price_level)}
            </Text>
          </Text>
        </View>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {restaurant.address}, {restaurant.city}
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          {restaurant.has_wifi && (
            <View style={styles.featureItem}>
              <Ionicons name="wifi-outline" size={14} color="#666" />
            </View>
          )}
          {restaurant.has_parking && (
            <View style={styles.featureItem}>
              <Ionicons name="car-outline" size={14} color="#666" />
            </View>
          )}
          {restaurant.has_outdoor_seating && (
            <View style={styles.featureItem}>
              <Ionicons name="sunny-outline" size={14} color="#666" />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  cuisineText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
  },
  priceTextInactive: {
    color: '#ccc',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
  },
  featureItem: {
    marginRight: 12,
  },
});

export default RestaurantCard;
