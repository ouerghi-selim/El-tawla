import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Restaurant {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'suspended';
  email: string;
  address: string;
  registrationDate: string;
  rating: number;
  totalReservations: number;
}

export default function RestaurantsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Le Petit Bistrot',
      status: 'pending',
      email: 'contact@petitbistrot.com',
      address: '123 Avenue de Paris, Tunis',
      registrationDate: '2025-02-20',
      rating: 0,
      totalReservations: 0,
    },
    {
      id: '2',
      name: 'Le Baroque',
      status: 'active',
      email: 'info@lebaroque.com',
      address: '45 Rue de Rome, Tunis',
      registrationDate: '2025-01-15',
      rating: 4.8,
      totalReservations: 156,
    },
    {
      id: '3',
      name: 'Dar El Jeld',
      status: 'active',
      email: 'contact@dareljeld.com',
      address: 'Medina, Tunis',
      registrationDate: '2025-01-10',
      rating: 4.9,
      totalReservations: 234,
    },
    {
      id: '4',
      name: 'La Terrasse',
      status: 'suspended',
      email: 'info@laterrasse.com',
      address: '78 Avenue de Carthage, Tunis',
      registrationDate: '2024-12-20',
      rating: 3.5,
      totalReservations: 45,
    },
  ];

  const handleStatusChange = async (restaurantId: string, newStatus: 'active' | 'suspended') => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || restaurant.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'suspended':
        return '#F44336';
      default:
        return '#666';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurant Management</Text>
        <Text style={styles.subtitle}>
          {restaurants.length} restaurants registered
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
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
          style={[styles.filterChip, filter === 'active' && styles.activeFilterChip]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.activeFilterText]}>
            Active
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filter === 'suspended' && styles.activeFilterChip]}
          onPress={() => setFilter('suspended')}
        >
          <Text style={[styles.filterText, filter === 'suspended' && styles.activeFilterText]}>
            Suspended
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.restaurantList}>
        {filteredRestaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.restaurantCard}>
            <View style={styles.restaurantHeader}>
              <View>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantEmail}>{restaurant.email}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(restaurant.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(restaurant.status) }]}>
                  {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.restaurantInfo}>
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{restaurant.address}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.infoText}>
                  Registered: {new Date(restaurant.registrationDate).toLocaleDateString()}
                </Text>
              </View>
              {restaurant.status !== 'pending' && (
                <>
                  <View style={styles.infoItem}>
                    <Ionicons name="star-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>Rating: {restaurant.rating.toFixed(1)}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="book-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {restaurant.totalReservations} reservations
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.actions}>
              {restaurant.status === 'pending' ? (
                <>
                  <Pressable
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleStatusChange(restaurant.id, 'active')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Approve</Text>
                      </>
                    )}
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleStatusChange(restaurant.id, 'suspended')}
                    disabled={isLoading}
                  >
                    <Ionicons name="close-circle" size={20} color="#dc3545" />
                    <Text style={[styles.actionButtonText, { color: '#dc3545' }]}>Reject</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable style={[styles.actionButton, styles.viewButton]}>
                    <Ionicons name="eye" size={20} color="#2196F3" />
                    <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>View</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.actionButton,
                      restaurant.status === 'active' ? styles.suspendButton : styles.activateButton
                    ]}
                    onPress={() => handleStatusChange(
                      restaurant.id,
                      restaurant.status === 'active' ? 'suspended' : 'active'
                    )}
                  >
                    <Ionicons
                      name={restaurant.status === 'active' ? 'pause-circle' : 'play-circle'}
                      size={20}
                      color={restaurant.status === 'active' ? '#FF9800' : '#4CAF50'}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: restaurant.status === 'active' ? '#FF9800' : '#4CAF50' }
                      ]}
                    >
                      {restaurant.status === 'active' ? 'Suspend' : 'Activate'}
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
  restaurantList: {
    padding: 20,
    paddingTop: 0,
  },
  restaurantCard: {
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
  restaurantHeader: {
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
  restaurantEmail: {
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
  restaurantInfo: {
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
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
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  viewButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  suspendButton: {
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  activateButton: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
});