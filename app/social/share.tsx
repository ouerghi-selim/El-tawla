import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { shareReservation } from '../store/slices/socialSlice';

const ShareScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.social);
  const { user } = useSelector(state => state.auth);
  
  const { reservationId } = route.params || {};
  const [reservation, setReservation] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  
  useEffect(() => {
    if (reservationId) {
      // Fetch reservation details
      fetchReservationDetails();
    }
  }, [reservationId]);
  
  const fetchReservationDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          date,
          time,
          party_size,
          restaurants (
            id,
            name,
            address,
            city,
            phone,
            cover_image
          )
        `)
        .eq('id', reservationId)
        .single();
      
      if (error) throw error;
      setReservation(data);
      
      // Set default message
      setMessage(`J'ai réservé une table chez ${data.restaurants.name} pour ${data.party_size} personnes le ${data.date} à ${data.time}. Rejoins-moi via El Tawla!`);
    } catch (error) {
      console.error('Error fetching reservation details:', error);
    }
  };
  
  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    Haptics.selectionAsync();
  };
  
  const handleShare = () => {
    if (reservationId && selectedPlatform) {
      dispatch(shareReservation({
        reservationId,
        platform: selectedPlatform,
        message
      }));
      
      // Feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Navigate back after sharing
      navigation.goBack();
    }
  };
  
  if (!reservation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E3735E" />
        <Text style={styles.loadingText}>Chargement des détails de la réservation...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Partager ma réservation</Text>
          <Text style={styles.subtitle}>
            Invitez vos amis à vous rejoindre pour votre réservation
          </Text>
        </View>
        
        <View style={styles.reservationCard}>
          <Image
            source={{ uri: reservation.restaurants.cover_image || 'https://via.placeholder.com/150' }}
            style={styles.restaurantImage}
            resizeMode="cover"
          />
          
          <View style={styles.reservationDetails}>
            <Text style={styles.restaurantName}>{reservation.restaurants.name}</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{reservation.date}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{reservation.time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{reservation.party_size} personnes</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.detailText} numberOfLines={1}>
                {reservation.restaurants.address}, {reservation.restaurants.city}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.messageSection}>
          <Text style={styles.sectionTitle}>Message</Text>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            multiline
            placeholder="Ajouter un message personnalisé"
          />
        </View>
        
        <View style={styles.platformsSection}>
          <Text style={styles.sectionTitle}>Choisir une plateforme</Text>
          
          <View style={styles.platformsGrid}>
            <Pressable
              style={[
                styles.platformItem,
                selectedPlatform === 'whatsapp' && styles.selectedPlatform
              ]}
              onPress={() => handlePlatformSelect('whatsapp')}
            >
              <View style={[styles.platformIcon, { backgroundColor: '#25D366' }]}>
                <Ionicons name="logo-whatsapp" size={24} color="#fff" />
              </View>
              <Text style={styles.platformName}>WhatsApp</Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.platformItem,
                selectedPlatform === 'facebook' && styles.selectedPlatform
              ]}
              onPress={() => handlePlatformSelect('facebook')}
            >
              <View style={[styles.platformIcon, { backgroundColor: '#3b5998' }]}>
                <Ionicons name="logo-facebook" size={24} color="#fff" />
              </View>
              <Text style={styles.platformName}>Facebook</Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.platformItem,
                selectedPlatform === 'twitter' && styles.selectedPlatform
              ]}
              onPress={() => handlePlatformSelect('twitter')}
            >
              <View style={[styles.platformIcon, { backgroundColor: '#1DA1F2' }]}>
                <Ionicons name="logo-twitter" size={24} color="#fff" />
              </View>
              <Text style={styles.platformName}>Twitter</Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.platformItem,
                selectedPlatform === 'email' && styles.selectedPlatform
              ]}
              onPress={() => handlePlatformSelect('email')}
            >
              <View style={[styles.platformIcon, { backgroundColor: '#D44638' }]}>
                <Ionicons name="mail" size={24} color="#fff" />
              </View>
              <Text style={styles.platformName}>Email</Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.platformItem,
                selectedPlatform === 'sms' && styles.selectedPlatform
              ]}
              onPress={() => handlePlatformSelect('sms')}
            >
              <View style={[styles.platformIcon, { backgroundColor: '#5BC236' }]}>
                <Ionicons name="chatbubble" size={24} color="#fff" />
              </View>
              <Text style={styles.platformName}>SMS</Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.platformItem,
                selectedPlatform === 'other' && styles.selectedPlatform
              ]}
              onPress={() => handlePlatformSelect('other')}
            >
              <View style={[styles.platformIcon, { backgroundColor: '#888' }]}>
                <Ionicons name="share-social" size={24} color="#fff" />
              </View>
              <Text style={styles.platformName}>Autre</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.shareButton,
            !selectedPlatform && styles.disabledButton
          ]}
          onPress={handleShare}
          disabled={!selectedPlatform}
        >
          <Text style={styles.shareButtonText}>Partager</Text>
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
  reservationCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  reservationDetails: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  messageSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  messageInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  platformsSection: {
    margin: 16,
    marginBottom: 100, // Extra space for footer
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  selectedPlatform: {
    backgroundColor: '#f0e5e3',
    borderWidth: 1,
    borderColor: '#E3735E',
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformName: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  shareButton: {
    backgroundColor: '#E3735E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ShareScreen;
