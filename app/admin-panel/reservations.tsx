import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Reservation {
  id: string;
  restaurant: {
    name: string;
    address: string;
  };
  customer: {
    name: string;
    email: string;
    reliability: number;
  };
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  specialRequests?: string;
}

export default function ReservationsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const reservations: Reservation[] = [
    {
      id: '1',
      restaurant: {
        name: 'Le Baroque',
        address: '15 Avenue Habib Bourguiba, Tunis',
      },
      customer: {
        name: 'Sarah Ben Ali',
        email: 'sarah@example.com',
        reliability: 95,
      },
      date: '2025-02-22',
      time: '19:00',
      guests: 2,
      status: 'pending',
      specialRequests: 'Window seat preferred',
    },
    {
      id: '2',
      restaurant: {
        name: 'Dar El Jeld',
        address: 'Medina, Tunis',
      },
      customer: {
        name: 'Ahmed Karim',
        email: 'ahmed@example.com',
        reliability: 88,
      },
      date: '2025-02-22',
      time: '20:30',
      guests: 4,
      status: 'confirmed',
    },
    {
      id: '3',
      restaurant: {
        name: 'La Terrasse',
        address: '78 Avenue de Carthage, Tunis',
      },
      customer: {
        name: 'Leila Mansour',
        email: 'leila@example.com',
        reliability: 75,
      },
      date: '2025-02-21',
      time: '19:30',
      guests: 3,
      status: 'cancelled',
    },
  ];

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || reservation.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reservations Management</Text>
        <Text style={styles.subtitle}>
          {reservations.length} total reservations
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search reservations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </Pressable>
        ) : null}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        <Pressable
          style={[styles.filterChip, filter === 'all' && styles.activeFilterChip]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filter === 'pending' && styles.activeFilterChip]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>
            Pending
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filter === 'confirmed' && styles.activeFilterChip]}
          onPress={() => setFilter('confirmed')}
        >
          <Text style={[styles.filterText, filter === 'confirmed' && styles.activeFilterText]}>
            Confirmed
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filter === 'completed' && styles.activeFilterChip]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
            Completed
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filter === 'cancelled' && styles.activeFilterChip]}
          onPress={() => setFilter('cancelled')}
        >
          <Text style={[styles.filterText, filter === 'cancelled' && styles.activeFilterText]}>
            Cancelled
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.reservationsList}>
        {filteredReservations.map((reservation) => (
          <View key={reservation.id} style={styles.reservationCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.restaurantName}>{reservation.restaurant.name}</Text>
                <Text style={styles.restaurantAddress}>{reservation.restaurant.address}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(reservation.status) + '20' }
              ]}>
                <Text style={[styles.statusText, { color: getStatusColor(reservation.status) }]}>
                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <View style={styles.customerHeader}>
                <View>
                  <Text style={styles.customerName}>{reservation.customer.name}</Text>
                  <Text style={styles.customerEmail}>{reservation.customer.email}</Text>
                </View>
                <View style={styles.reliabilityScore}>
                  <Text style={[
                    styles.reliabilityText,
                    { color: getReliabilityColor(reservation.customer.reliability) }
                  ]}>
                    {reservation.customer.reliability}% Reliable
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.reservationDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.detailText}>
                  {new Date(reservation.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{reservation.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{reservation.guests} guests</Text>
              </View>
              {reservation.specialRequests && (
                <View style={styles.detailRow}>
                  <Ionicons name="information-circle-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>{reservation.specialRequests}</Text>
                </View>
              )}
            </View>

            <View style={styles.actions}>
              <Pressable style={[styles.actionButton, styles.viewButton]}>
                <Ionicons name="eye-outline" size={20} color="#2196F3" />
                <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>
                  View Details
                </Text>
              </Pressable>
              {reservation.status === 'pending' && (
                <>
                  <Pressable style={[styles.actionButton, styles.confirmButton]}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                    <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>
                      Confirm
                    </Text>
                  </Pressable>
                  <Pressable style={[styles.actionButton, styles.cancelButton]}>
                    <Ionicons name="close-circle-outline" size={20} color="#F44336" />
                    <Text style={[styles.actionButtonText, { color: '#F44336' }]}>
                      Cancel
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilterChip: {
    backgroundColor: '#E3735E',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  reservationsList: {
    padding: 20,
    paddingTop: 0,
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  customerInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  customerEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  reliabilityScore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  reliabilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reservationDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  actionButtonText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  confirmButton: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#F44336',
  },
});