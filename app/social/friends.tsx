import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { fetchUserFriends } from '../store/slices/socialSlice';

const FriendsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { friends, loading, error } = useSelector(state => state.social);
  const { user } = useSelector(state => state.auth);
  
  const [friendRequests, setFriendRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchUserFriends(user.id));
      fetchFriendRequests();
    }
  }, [dispatch, user]);
  
  const fetchFriendRequests = async () => {
    try {
      setIsLoadingRequests(true);
      
      const { data, error } = await supabase
        .from('user_friends')
        .select(`
          id,
          user_id,
          users!user_id (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      setFriendRequests(data || []);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };
  
  const handleAcceptFriendRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('user_friends')
        .update({ status: 'accepted' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Refresh friend requests and friends list
      fetchFriendRequests();
      dispatch(fetchUserFriends(user.id));
      
      // Feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };
  
  const handleRejectFriendRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('user_friends')
        .delete()
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Refresh friend requests
      fetchFriendRequests();
      
      // Feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };
  
  const renderFriendItem = ({ item }) => (
    <Pressable
      style={styles.friendCard}
      onPress={() => navigation.navigate('FriendProfile', { friendId: item.id })}
    >
      <Image
        source={{ uri: item.avatar_url || 'https://via.placeholder.com/100' }}
        style={styles.friendAvatar}
      />
      
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>
          {item.first_name} {item.last_name}
        </Text>
        
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('RecommendRestaurants', { friendId: item.id })}
          >
            <Ionicons name="restaurant-outline" size={16} color="#E3735E" />
            <Text style={styles.actionText}>Recommander</Text>
          </Pressable>
          
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('InviteFriend', { friendId: item.id })}
          >
            <Ionicons name="calendar-outline" size={16} color="#E3735E" />
            <Text style={styles.actionText}>Inviter</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
  
  const renderRequestItem = ({ item }) => (
    <View style={styles.requestCard}>
      <Image
        source={{ uri: item.users.avatar_url || 'https://via.placeholder.com/100' }}
        style={styles.requestAvatar}
      />
      
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>
          {item.users.first_name} {item.users.last_name}
        </Text>
        <Text style={styles.requestText}>
          souhaite vous ajouter comme ami
        </Text>
      </View>
      
      <View style={styles.requestActions}>
        <Pressable
          style={[styles.requestButton, styles.acceptButton]}
          onPress={() => handleAcceptFriendRequest(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accepter</Text>
        </Pressable>
        
        <Pressable
          style={[styles.requestButton, styles.rejectButton]}
          onPress={() => handleRejectFriendRequest(item.id)}
        >
          <Text style={styles.rejectButtonText}>Refuser</Text>
        </Pressable>
      </View>
    </View>
  );
  
  if (loading && friends.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E3735E" />
        <Text style={styles.loadingText}>Chargement de vos amis...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Mes amis</Text>
          <Pressable
            style={styles.addButton}
            onPress={() => navigation.navigate('FindFriends')}
          >
            <Ionicons name="person-add-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </Pressable>
        </View>
        
        {friendRequests.length > 0 && (
          <View style={styles.requestsSection}>
            <Text style={styles.sectionTitle}>Demandes d'amis</Text>
            <FlatList
              data={friendRequests}
              renderItem={renderRequestItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
        
        <View style={styles.friendsSection}>
          <Text style={styles.sectionTitle}>Tous mes amis</Text>
          
          {friends.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateTitle}>Aucun ami</Text>
              <Text style={styles.emptyStateText}>
                Vous n'avez pas encore d'amis. Ajoutez des amis pour partager vos expériences culinaires et découvrir de nouveaux restaurants.
              </Text>
              <Pressable
                style={styles.findFriendsButton}
                onPress={() => navigation.navigate('FindFriends')}
              >
                <Text style={styles.findFriendsButtonText}>Trouver des amis</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={friends}
              renderItem={renderFriendItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.friendsList}
            />
          )}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3735E',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  requestsSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  friendsSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  requestAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  requestText: {
    fontSize: 14,
    color: '#666',
  },
  requestActions: {
    flexDirection: 'row',
  },
  requestButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#E3735E',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#f0f0f0',
  },
  rejectButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  friendsList: {
    paddingBottom: 16,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E3735E',
  },
  actionText: {
    color: '#E3735E',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
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
  findFriendsButton: {
    backgroundColor: '#E3735E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  findFriendsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FriendsScreen;
