import { View, Text, StyleSheet, ScrollView, Image, Pressable, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../../store/slices/favoriteSlice';
import BookingForm from '../../../components/BookingForm';
import type { AppDispatch, RootState } from '../../../store';

const restaurantData = {
  '1': {
    id: '1',
    name: 'Le Baroque',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    cuisine: 'Mediterranean, Tunisian',
    rating: 4.8,
    priceRange: '₪₪₪',
    description: 'Experience the finest Mediterranean and Tunisian cuisine in an elegant setting. Our chefs combine traditional recipes with modern techniques.',
    address: '15 Avenue Habib Bourguiba, Tunis',
    hours: '12:00 PM - 11:00 PM',
    phone: '+216 71 123 456',
    menu: [
      { category: 'Starters', items: [
        { name: 'Tunisian Brik', price: 8, description: 'Crispy pastry filled with egg and tuna' },
        { name: 'Mechouia', price: 10, description: 'Grilled vegetable salad with tuna' }
      ]},
      { category: 'Main Courses', items: [
        { name: 'Couscous Royal', price: 25, description: 'Traditional couscous with lamb and vegetables' },
        { name: 'Grilled Sea Bass', price: 30, description: 'Fresh sea bass with saffron sauce' }
      ]},
    ]
  },
  '2': {
    id: '2',
    name: 'Dar El Jeld',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330',
    cuisine: 'Traditional Tunisian',
    rating: 4.9,
    priceRange: '₪₪₪₪',
    description: 'Housed in a historic building, Dar El Jeld offers authentic Tunisian cuisine in a stunning traditional setting.',
    address: '5-10 Rue Dar El Jeld, Medina of Tunis',
    hours: '12:30 PM - 10:30 PM',
    phone: '+216 71 987 654',
    menu: [
      { category: 'Starters', items: [
        { name: 'Slata Tounsia', price: 12, description: 'Traditional Tunisian salad' },
        { name: 'Harissa Prawns', price: 15, description: 'Spicy grilled prawns' }
      ]},
      { category: 'Main Courses', items: [
        { name: 'Tajine Zeitoun', price: 28, description: 'Lamb with olives and preserved lemons' },
        { name: 'Samak Meshwi', price: 32, description: 'Grilled fish with chermoula' }
      ]},
    ]
  }
};

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const [showBooking, setShowBooking] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const isFavorite = favorites.includes(id as string);
  
  const restaurant = restaurantData[id as keyof typeof restaurantData];

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  const handleBookingSuccess = () => {
    router.push({
      pathname: '/reservations',
      params: {
        success: true,
        restaurant: restaurant.name
      }
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: restaurant.name,
        message: `Check out ${restaurant.name} on TunisiaBistrot!\n\n${restaurant.description}\n\nAverage price: ${restaurant.priceRange}\n\nBook now:`,
        url: `https://tunisiabistrot.com/restaurant/${id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFavoritePress = () => {
    dispatch(toggleFavorite(id as string));
  };

  const calculateAveragePrice = () => {
    const prices = restaurant.menu.flatMap(category => 
      category.items.map(item => item.price)
    );
    const average = prices.reduce((a, b) => a + b, 0) / prices.length;
    return Math.round(average);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${restaurant.image}?w=800` }}
          style={styles.image}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.info}>
            {restaurant.cuisine} • {restaurant.rating}★ • {restaurant.priceRange}
          </Text>
          <Text style={styles.averagePrice}>
            Average price: {calculateAveragePrice()} TND
          </Text>
        </LinearGradient>
        <View style={styles.headerButtons}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <View style={styles.rightButtons}>
            <Pressable style={styles.actionButton} onPress={handleFavoritePress}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#E3735E" : "white"}
              />
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.description}>{restaurant.description}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{restaurant.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{restaurant.hours}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{restaurant.phone}</Text>
          </View>
        </View>

        {showBooking ? (
          <View style={styles.section}>
            <BookingForm
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              onSuccess={handleBookingSuccess}
            />
          </View>
        ) : (
          <Pressable
            style={styles.bookingButton}
            onPress={() => setShowBooking(true)}
          >
            <Text style={styles.bookingButtonText}>Make a Reservation</Text>
          </Pressable>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {restaurant.menu.map((category) => (
            <View key={category.category} style={styles.menuCategory}>
              <Text style={styles.categoryTitle}>{category.category}</Text>
              {category.items.map((item) => (
                <View key={item.name} style={styles.menuItem}>
                  <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>{item.price} TND</Text>
                  </View>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </View>
              ))}
            </View>
          ))}
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
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 20,
    justifyContent: 'flex-end',
  },
  headerButtons: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  rightButtons: {
    flexDirection: 'row',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  info: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
  averagePrice: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  bookingButton: {
    backgroundColor: '#E3735E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  menuCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  menuItem: {
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
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  menuItemPrice: {
    fontSize: 16,
    color: '#E3735E',
    fontWeight: '500',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
  },
});