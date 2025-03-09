import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
  registrationDate: string;
  lastLogin: string;
  reservations: number;
  reliability: number;
  points: number;
}

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');

  const users: User[] = [
    {
      id: '1',
      name: 'Sarah Ben Ali',
      email: 'sarah@example.com',
      status: 'active',
      registrationDate: '2025-01-15',
      lastLogin: '2025-02-20',
      reservations: 12,
      reliability: 95,
      points: 2500,
    },
    {
      id: '2',
      name: 'Ahmed Karim',
      email: 'ahmed@example.com',
      status: 'active',
      registrationDate: '2025-01-10',
      lastLogin: '2025-02-19',
      reservations: 8,
      reliability: 88,
      points: 1800,
    },
    {
      id: '3',
      name: 'Leila Mansour',
      email: 'leila@example.com',
      status: 'suspended',
      registrationDate: '2024-12-20',
      lastLogin: '2025-01-15',
      reservations: 3,
      reliability: 65,
      points: 500,
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <Text style={styles.subtitle}>
          {users.length} registered users
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
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
            All Users
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

      <View style={styles.userList}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: user.status === 'active' ? '#e8f5e9' : '#ffebee' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: user.status === 'active' ? '#4CAF50' : '#F44336' }
                ]}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.reservations}</Text>
                <Text style={styles.statLabel}>Reservations</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[
                  styles.statValue,
                  { color: getReliabilityColor(user.reliability) }
                ]}>
                  {user.reliability}%
                </Text>
                <Text style={styles.statLabel}>Reliability</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  Registered: {new Date(user.registrationDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  Last login: {new Date(user.lastLogin).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable style={[styles.actionButton, styles.viewButton]}>
                <Ionicons name="eye-outline" size={20} color="#2196F3" />
                <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>View Profile</Text>
              </Pressable>
              {user.status === 'active' ? (
                <Pressable style={[styles.actionButton, styles.suspendButton]}>
                  <Ionicons name="ban-outline" size={20} color="#FF9800" />
                  <Text style={[styles.actionButtonText, { color: '#FF9800' }]}>Suspend</Text>
                </Pressable>
              ) : (
                <Pressable style={[styles.actionButton, styles.activateButton]}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                  <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Activate</Text>
                </Pressable>
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
  userList: {
    padding: 20,
    paddingTop: 0,
  },
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userEmail: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  userDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
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