import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

type ReservationStatus = 'upcoming' | 'past' | 'cancelled';
type TabType = 'upcoming' | 'past' | 'cancelled';

interface Reservation {
  id: string;
  restaurant: {
    name: string;
    image: string;
    address: string;
  };
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  specialRequests?: string;
  tableNumber?: string;
}

export default function ReservationsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const router = useRouter();

  const reservations: Reservation[] = [
    {
      id: '1',
      restaurant: {
        name: 'Le Baroque',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        address: '15 Avenue Habib Bourguiba, Tunis',
      },
      date: '2025-02-22',
      time: '19:00',
      guests: 2,
      status: 'upcoming',
      tableNumber: 'A12',
      specialRequests: 'Window seat preferred',
    },
    {
      id: '2',
      restaurant: {
        name: 'Dar El Jeld',
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330',
        address: '5-10 Rue Dar El Jeld, Medina of Tunis',
      },
      date: '2025-02-23',
      time: '20:30',
      guests: 4,
      status: 'upcoming',
      tableNumber: 'B8',
    },
    {
      id: '3',
      restaurant: {
        name: 'Le Baroque',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        address: '15 Avenue Habib Bourguiba, Tunis',
      },
      date: '2025-01-15',
      time: '19:30',
      guests: 2,
      status: 'past',
    },
    {
      id: '4',
      restaurant: {
        name: 'Dar El Jeld',
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330',
        address: '5-10 Rue Dar El Jeld, Medina of Tunis',
      },
      date: '2025-01-10',
      time: '20:00',
      guests: 3,
      status: 'cancelled',
    },
  ];

  const filteredReservations = reservations.filter(res => res.status === activeTab);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCancelReservation = (id: string) => {
    // In a real app, this would call an API to cancel the reservation
    console.log('Cancelling reservation:', id);
  };

  const handleModifyReservation = (id: string) => {
    // In a real app, this would navigate to a modification screen
    console.log('Modifying reservation:', id);
  };

  const handleRestaurantPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#E3735E" />
      <Text style={styles.emptyTitle}>No {activeTab} reservations</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming'
          ? "You don't have any upcoming reservations"
          : activeTab === 'past'
          ? "You haven't visited any restaurants yet"
          : "You don't have any cancelled reservations"}
      </Text>
      {activeTab === 'upcoming' && (
        <Pressable
          style={styles.exploreButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.exploreButtonText}>Find Restaurants</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Reservations</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
            Cancelled
          </Text>
        </Pressable>
      </View>

      {filteredReservations.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView style={styles.content}>
          {filteredReservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationCard}>
              <Pressable
                onPress={() => handleRestaurantPress('1')} // Replace with actual restaurant ID
                style={styles.restaurantSection}
              >
                <Image
                  source={{ uri: reservation.restaurant.image }}
                  style={styles.restaurantImage}
                />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{reservation.restaurant.name}</Text>
                  <Text style={styles.restaurantAddress}>{reservation.restaurant.address}</Text>
                </View>
              </Pressable>

              <View style={styles.reservationDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>{formatDate(reservation.date)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>{reservation.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>{reservation.guests} guests</Text>
                </View>
                {reservation.tableNumber && (
                  <View style={styles.detailRow}>
                    <Ionicons name="grid-outline" size={20} color="#666" />
                    <Text style={styles.detailText}>Table {reservation.tableNumber}</Text>
                  </View>
                )}
                {reservation.specialRequests && (
                  <View style={styles.detailRow}>
                    <Ionicons name="information-circle-outline" size={20} color="#666" />
                    <Text style={styles.detailText}>{reservation.specialRequests}</Text>
                  </View>
                )}
              </View>

              {activeTab === 'upcoming' && (
                <View style={styles.actions}>
                  <Pressable
                    style={[styles.actionButton, styles.modifyButton]}
                    onPress={() => handleModifyReservation(reservation.id)}
                  >
                    <Ionicons name="create-outline" size={20} color="#E3735E" />
                    <Text style={styles.modifyButtonText}>Modify</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleCancelReservation(reservation.id)}
                  >
                    <Ionicons name="close-circle-outline" size={20} color="#dc3545" />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                </View>
              )}

              {activeTab === 'past' && (
                <Pressable
                  style={styles.reviewButton}
                  onPress={() => console.log('Write review')}
                >
                  <Ionicons name="star-outline" size={20} color="#E3735E" />
                  <Text style={styles.reviewButtonText}>Write Review</Text>
                </Pressable>
              )}
            </View>
          ))}
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  activeTab: {
    borderBottomColor: '#E3735E',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#E3735E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#E3735E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantSection: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
  },
  reservationDetails: {
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  modifyButton: {
    backgroundColor: '#fff5f3',
  },
  modifyButtonText: {
    color: '#E3735E',
    marginLeft: 5,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#fff5f5',
  },
  cancelButtonText: {
    color: '#dc3545',
    marginLeft: 5,
    fontWeight: '500',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reviewButtonText: {
    color: '#E3735E',
    marginLeft: 5,
    fontWeight: '500',
    fontSize: 16,
  },
});