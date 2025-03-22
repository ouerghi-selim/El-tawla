import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { 
  fetchUserFavorites, 
  fetchUserFriends, 
  recommendRestaurant 
} from '../../store/slices/socialSlice';

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { favorites, friends, loading, error } = useSelector(state => state.social);
  const { user } = useSelector(state => state.auth);
  
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [recommendMessage, setRecommendMessage] = useState('');
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [restaurantToRecommend, setRestaurantToRecommend] = useState(null);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchUserFavorites(user.id));
      dispatch(fetchUserFriends(user.id));
    }
  }, [dispatch, user]);
  
  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetails', { restaurantId: restaurant.id });
  };
  
  const handleRecommendPress = (restaurant) => {
    setRestaurantToRecommend(restaurant);
    setShowRecommendModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const toggleFriendSelection = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
    Haptics.selectionAsync();
  };
  
  const handleSendRecommendation = () => {
    if (selectedFriends.length > 0 && restaurantToRecommend) {
      dispatch(recommendRestaurant({
        userId: user.id,
        restaurantId: restaurantToRecommend.id,
        friendIds: selectedFriends,
        message: recommendMessage
      }));
      
      // Reset and close modal
      setSelectedFriends([]);
      setRecommendMessage('');
      setShowRecommendModal(false);
      setRestaurantToRecommend(null);
      
      // Feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const renderFavoriteItem = ({ item }) => (
    <Pressable
      style={styles.favoriteCard}
      onPress={() => handleRestaurantPress(item.restaurant)}
    >
      <Image
        source={{ uri: item.restaurant.cover_image || 'https://via.placeholder.com/150' }}
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      
      <View style={styles.favoriteContent}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {item.restaurant.name}
        </Text>
        
        <Text style={styles.restaurantLocation} numberOfLines={1}>
          {item.restaurant.city}
        </Text>
        
        <View style={styles.cuisineContainer}>
          {item.restaurant.cuisine_types && item.restaurant.cuisine_types.map((cuisine, index) => (
            <Text key={index} style={styles.cuisineText}>
              {index > 0 ? ' • ' : ''}{cuisine}
            </Text>
          ))}
        </View>
      </View>
      
      <Pressable
        style={styles.recommendButton}
        onPress={() => handleRecommendPress(item.restaurant)}
      >
        <Ionicons name="share-social-outline" size={20} color="#E3735E" />
      </Pressable>
    </Pressable>
  );
  
  const renderFriendItem = ({ item }) => (
    <Pressable
      style={[
        styles.friendItem,
        selectedFriends.includes(item.id) && styles.selectedFriendItem
      ]}
      onPress={() => toggleFriendSelection(item.id)}
    >
      <Image
        source={{ uri: item.avatar_url || 'https://via.placeholder.com/50' }}
        style={styles.friendAvatar}
      />
      <Text style={styles.friendName}>
        {item.first_name} {item.last_name}
      </Text>
      
      {selectedFriends.includes(item.id) && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
      )}
    </Pressable>
  );
  
  if (loading && favorites.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E3735E" />
        <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Mes restaurants favoris</Text>
          <Text style={styles.subtitle}>
            Enregistrez vos restaurants préférés et partagez-les avec vos amis
          </Text>
        </View>
        
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>Aucun favori</Text>
            <Text style={styles.emptyStateText}>
              Vous n'avez pas encore ajouté de restaurants à vos favoris.
              Explorez les restaurants et ajoutez-les à vos favoris pour les retrouver ici.
            </Text>
            <Pressable
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.exploreButtonText}>Explorer les restaurants</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.favoritesList}
          />
        )}
      </ScrollView>
      
      {/* Recommend Modal */}
      {showRecommendModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recommander à des amis</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setShowRecommendModal(false);
                  setSelectedFriends([]);
                  setRecommendMessage('');
                  setRestaurantToRecommend(null);
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
            </View>
            
            {restaurantToRecommend && (
              <View style={styles.recommendRestaurantInfo}>
                <Image
                  source={{ uri: restaurantToRecommend.cover_image || 'https://via.placeholder.com/100' }}
                  style={styles.recommendRestaurantImage}
                  resizeMode="cover"
                />
                <View style={styles.recommendRestaurantDetails}>
                  <Text style={styles.recommendRestaurantName}>
                    {restaurantToRecommend.name}
                  </Text>
                  <Text style={styles.recommendRestaurantLocation}>
                    {restaurantToRecommend.city}
                  </Text>
                </View>
              </View>
            )}
            
            <Text style={styles.friendsLabel}>Sélectionnez des amis</Text>
            
            {friends.length === 0 ? (
              <Text style={styles.noFriendsText}>
                Vous n'avez pas encore d'amis dans votre liste.
              </Text>
            ) : (
              <FlatList
                data={friends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.id}
                horizontal={false}
                style={styles.friendsList}
              />
            )}
            
            <TextInput
              style={styles.messageInput}
              placeholder="Ajouter un message (optionnel)"
              value={recommendMessage}
              onChangeText={setRecommendMessage}
              multiline
            />
            
            <Pressable
              style={[
                styles.sendButton,
                (selectedFriends.length === 0) && styles.disabledButton
              ]}
              onPress={handleSendRecommendation}
              disabled={selectedFriends.length === 0}
            >
              <Text style={styles.sendButtonText}>
                Envoyer la recommandation
              </Text>
            </Pressable>
          </View>
        </View>
      )}
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#E3735E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  favoritesList: {
    padding: 16,
  },
  favoriteCard: {
    flexDirection: 'row',
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
  restaurantImage: {
    width: 100,
    height: '100%',
  },
  favoriteContent: {
    flex: 1,
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  restaurantLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cuisineText: {
    fontSize: 12,
    color: '#999',
  },
  recommendButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  recommendRestaurantInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  recommendRestaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  recommendRestaurantDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  recommendRestaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  recommendRestaurantLocation: {
    fontSize: 14,
    color: '#666',
  },
  friendsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  noFriendsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  friendsList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedFriendItem: {
    backgroundColor: '#f0e5e3',
    borderWidth: 1,
    borderColor: '#E3735E',
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendName: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E3735E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#E3735E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesScreen;
