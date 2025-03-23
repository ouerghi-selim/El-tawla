import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
//import MapView, { Marker } from 'react-native-maps';

import { getRestaurantDetails, getRestaurantMenu, getRestaurantPhotos } from '../../utils/restaurantService';

const RestaurantDetails = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadRestaurantDetails();
  }, [restaurantId]);
  
  const loadRestaurantDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const restaurantData = await getRestaurantDetails(restaurantId);
      setRestaurant(restaurantData);
      
      const menuData = await getRestaurantMenu(restaurantId);
      setMenu(menuData);
      
      const photosData = await getRestaurantPhotos(restaurantId);
      setPhotos(photosData);
    } catch (err) {
      console.error('Error loading restaurant details:', err);
      setError('Impossible de charger les détails du restaurant');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    Haptics.selectionAsync();
  };
  
  const handleBookTable = () => {
    navigation.navigate('BookingScreen', { restaurantId: restaurantId });
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E3735E" />
        <Text style={styles.loadingText}>Chargement des détails du restaurant...</Text>
      </View>
    );
  }
  
  if (error || !restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#E3735E" />
        <Text style={styles.errorText}>{error || 'Restaurant non trouvé'}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={loadRestaurantDetails}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }
  
  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>À propos</Text>
        <Text style={styles.description}>{restaurant.description}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Spécialités</Text>
        <View style={styles.specialtiesContainer}>
          {restaurant.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Horaires d'ouverture</Text>
        {restaurant.opening_hours.map((day, index) => (
          <View key={index} style={styles.hourRow}>
            <Text style={styles.dayText}>{day.day}</Text>
            <Text style={styles.hoursText}>
              {day.is_closed ? 'Fermé' : `${day.open} - ${day.close}`}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Adresse</Text>
        <Text style={styles.addressText}>{restaurant.address}</Text>
        <Text style={styles.cityText}>{restaurant.postal_code} {restaurant.city}</Text>
        
        {/*<MapView*/}
        {/*  style={styles.map}*/}
        {/*  initialRegion={{*/}
        {/*    latitude: restaurant.latitude,*/}
        {/*    longitude: restaurant.longitude,*/}
        {/*    latitudeDelta: 0.01,*/}
        {/*    longitudeDelta: 0.01,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Marker*/}
        {/*    coordinate={{*/}
        {/*      latitude: restaurant.latitude,*/}
        {/*      longitude: restaurant.longitude,*/}
        {/*    }}*/}
        {/*    title={restaurant.name}*/}
        {/*  />*/}
        {/*</MapView>*/}
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations supplémentaires</Text>
        <View style={styles.amenitiesContainer}>
          {restaurant.has_wifi && (
            <View style={styles.amenityItem}>
              <Ionicons name="wifi-outline" size={20} color="#666" />
              <Text style={styles.amenityText}>Wi-Fi gratuit</Text>
            </View>
          )}
          {restaurant.has_parking && (
            <View style={styles.amenityItem}>
              <Ionicons name="car-outline" size={20} color="#666" />
              <Text style={styles.amenityText}>Parking disponible</Text>
            </View>
          )}
          {restaurant.is_accessible && (
            <View style={styles.amenityItem}>
              <Ionicons name="accessibility-outline" size={20} color="#666" />
              <Text style={styles.amenityText}>Accessible aux personnes à mobilité réduite</Text>
            </View>
          )}
          {restaurant.accepts_credit_cards && (
            <View style={styles.amenityItem}>
              <Ionicons name="card-outline" size={20} color="#666" />
              <Text style={styles.amenityText}>Accepte les cartes de crédit</Text>
            </View>
          )}
          {restaurant.has_outdoor_seating && (
            <View style={styles.amenityItem}>
              <Ionicons name="sunny-outline" size={20} color="#666" />
              <Text style={styles.amenityText}>Places en terrasse</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={20} color="#666" />
          <Text style={styles.contactText}>{restaurant.phone}</Text>
        </View>
        {restaurant.website && (
          <View style={styles.contactItem}>
            <Ionicons name="globe-outline" size={20} color="#666" />
            <Text style={styles.contactText}>{restaurant.website}</Text>
          </View>
        )}
        {restaurant.email && (
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.contactText}>{restaurant.email}</Text>
          </View>
        )}
      </View>
    </View>
  );
  
  const renderMenuTab = () => (
    <View style={styles.tabContent}>
      {menu.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={48} color="#999" />
          <Text style={styles.emptyStateText}>
            Menu non disponible pour ce restaurant
          </Text>
        </View>
      ) : (
        menu.map((category, index) => (
          <View key={index} style={styles.menuCategory}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            {category.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.menuItem}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                  {item.allergens && (
                    <Text style={styles.allergenText}>
                      Allergènes: {item.allergens.join(', ')}
                    </Text>
                  )}
                </View>
                <Text style={styles.menuItemPrice}>{item.price} DT</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );
  
  const renderPhotosTab = () => (
    <View style={styles.tabContent}>
      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={48} color="#999" />
          <Text style={styles.emptyStateText}>
            Aucune photo disponible pour ce restaurant
          </Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <Pressable
              style={styles.photoItem}
              onPress={() => {
                // Ouvrir la photo en plein écran
                navigation.navigate('PhotoViewer', { photoUrl: item.url });
              }}
            >
              <Image
                source={{ uri: item.url }}
                style={styles.photo}
                resizeMode="cover"
              />
              {item.caption && (
                <View style={styles.photoCaption}>
                  <Text style={styles.photoCaptionText} numberOfLines={1}>
                    {item.caption}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        />
      )}
    </View>
  );
  
  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      {restaurant.reviews.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubble-outline" size={48} color="#999" />
          <Text style={styles.emptyStateText}>
            Aucun avis pour ce restaurant
          </Text>
          <Pressable
            style={styles.writeReviewButton}
            onPress={() => navigation.navigate('WriteReview', { restaurantId })}
          >
            <Text style={styles.writeReviewButtonText}>Écrire un avis</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.reviewsSummary}>
            <View style={styles.ratingContainer}>
              <Text style={styles.averageRating}>{restaurant.average_rating.toFixed(1)}</Text>
              <View style={styles.starsContainer}>
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
                    size={20}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.reviewCount}>
                {restaurant.reviews.length} avis
              </Text>
            </View>
            
            <Pressable
              style={styles.writeReviewButton}
              onPress={() => navigation.navigate('WriteReview', { restaurantId })}
            >
              <Text style={styles.writeReviewButtonText}>Écrire un avis</Text>
            </Pressable>
          </View>
          
          {restaurant.reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewUser}>
                  <Text style={styles.reviewUserName}>{review.user_name}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.date).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? 'star' : 'star-outline'}
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.comment}</Text>
              {review.owner_response && (
                <View style={styles.ownerResponse}>
                  <Text style={styles.ownerResponseLabel}>Réponse du propriétaire:</Text>
                  <Text style={styles.ownerResponseText}>{review.owner_response}</Text>
                </View>
              )}
            </View>
          ))}
        </>
      )}
    </View>
  );
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: restaurant.cover_image }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.headerOverlay}>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <View style={styles.ratingRow}>
                <View style={styles.starsContainer}>
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
                  {restaurant.average_rating.toFixed(1)} ({restaurant.reviews.length})
                </Text>
              </View>
              <View style={styles.cuisineContainer}>
                {restaurant.cuisine_types.map((cuisine, index) => (
                  <Text key={index} style={styles.cuisineText}>
                    {index > 0 ? ' • ' : ''}{cuisine}
                  </Text>
                ))}
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {'€'.repeat(restaurant.price_level)}
                  <Text style={styles.priceTextInactive}>
                    {'€'.repeat(3 - restaurant.price_level)}
                  </Text>
                </Text>
                <Text style={styles.priceLabel}>
                  {restaurant.price_level === 1
                    ? 'Économique'
                    : restaurant.price_level === 2
                    ? 'Intermédiaire'
                    : 'Haut de gamme'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'info' && styles.activeTab]}
            onPress={() => handleTabChange('info')}
          >
            <Text
              style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}
            >
              Infos
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
            onPress={() => handleTabChange('menu')}
          >
            <Text
              style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}
            >
              Menu
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
            onPress={() => handleTabChange('photos')}
          >
            <Text
              style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}
            >
              Photos
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => handleTabChange('reviews')}
          >
            <Text
              style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}
            >
              Avis
            </Text>
          </Pressable>
        </View>
        
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'menu' && renderMenuTab()}
        {activeTab === 'photos' && renderPhotosTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable
          style={styles.bookButton}
          onPress={handleBookTable}
        >
          <Text style={styles.bookButtonText}>Réserver une table</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#E3735E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'relative',
    height: 250,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  restaurantInfo: {
    width: '100%',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#fff',
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  cuisineText: {
    fontSize: 14,
    color: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 8,
  },
  priceTextInactive: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  priceLabel: {
    fontSize: 14,
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E3735E',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#E3735E',
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 14,
    color: '#666',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  hoursText: {
    fontSize: 16,
    color: '#666',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  cityText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  amenitiesContainer: {
    marginTop: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  menuCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  allergenText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E3735E',
  },
  photoItem: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 150,
  },
  photoCaption: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  photoCaptionText: {
    color: '#fff',
    fontSize: 12,
  },
  reviewsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingContainer: {
    alignItems: 'flex-start',
  },
  averageRating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  writeReviewButton: {
    backgroundColor: '#E3735E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  writeReviewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewUser: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  ownerResponse: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  ownerResponseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  ownerResponseText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    backgroundColor: '#E3735E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default RestaurantDetails;
