import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserScore } from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store';

export default function AdminReservations() {
  const [filter, setFilter] = useState('all');
  const dispatch = useDispatch<AppDispatch>();
  const [reservations, setReservations] = useState([
    {
      id: '1',
      customerName: 'John Doe',
      date: '2025-02-22',
      time: '19:00',
      guests: 2,
      status: 'pending',
      phone: '+216 12 345 678',
      reliability_score: 95,
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      date: '2025-02-22',
      time: '20:30',
      guests: 4,
      status: 'confirmed',
      phone: '+216 98 765 432',
      reliability_score: 85,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'confirmed':
        return '#4CAF50';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#666';
    }
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FFC107';
    return '#dc3545';
  };

  const handleStatusChange = async (reservationId: string, newStatus: string, reliability_score: number) => {
    // Update reservation status
    setReservations(prev => 
      prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: newStatus }
          : res
      )
    );

    // Update user's reliability score based on action
    if (newStatus === 'cancelled') {
      // Penalize for cancellation
      await dispatch(updateUserScore({ 
        points: -100,
        reliability_score: -10
      }));
    } else if (newStatus === 'confirmed') {
      // Reward for confirmation
      await dispatch(updateUserScore({ 
        points: 50,
        reliability_score: 5
      }));
    }
  };

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(res => res.status === filter);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reservations</Text>
        <View style={styles.filterButtons}>
          <Pressable 
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>
              Pending
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.filterButton, filter === 'confirmed' && styles.activeFilter]}
            onPress={() => setFilter('confirmed')}
          >
            <Text style={[styles.filterText, filter === 'confirmed' && styles.activeFilterText]}>
              Confirmed
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.reservationsList}>
        {filteredReservations.map((reservation) => (
          <View key={reservation.id} style={styles.reservationCard}>
            <View style={styles.reservationHeader}>
              <View>
                <Text style={styles.customerName}>{reservation.customerName}</Text>
                <View style={styles.scoreContainer}>
                  <Text style={[
                    styles.reliabilityScore,
                    { color: getReliabilityColor(reservation.reliability_score) }
                  ]}>
                    Reliability Score: {reservation.reliability_score}%
                  </Text>
                  <Ionicons 
                    name="information-circle-outline" 
                    size={16} 
                    color="#666"
                    style={styles.infoIcon}
                  />
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
                <Text style={styles.statusText}>
                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.reservationDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{reservation.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{reservation.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{reservation.guests} guests</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{reservation.phone}</Text>
              </View>
            </View>

            {reservation.status === 'pending' && (
              <View style={styles.actionButtons}>
                <Pressable 
                  style={[styles.actionButton, styles.confirmButton]}
                  onPress={() => handleStatusChange(reservation.id, 'confirmed', reservation.reliability_score)}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Confirm</Text>
                </Pressable>
                <Pressable 
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleStatusChange(reservation.id, 'cancelled', reservation.reliability_score)}
                >
                  <Ionicons name="close-circle" size={20} color="#dc3545" />
                  <Text style={[styles.actionButtonText, styles.rejectButtonText]}>
                    Reject
                  </Text>
                </Pressable>
              </View>
            )}
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
    marginBottom: 15,
  },
  filterButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilter: {
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
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reliabilityScore: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoIcon: {
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  reservationDetails: {
    marginBottom: 15,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 5,
  },
  rejectButtonText: {
    color: '#dc3545',
  },
});