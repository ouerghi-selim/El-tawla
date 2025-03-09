import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function AdminDashboard() {
  const router = useRouter();
  const stats = useSelector((state: RootState) => ({
    totalUsers: 156,
    totalRestaurants: 42,
    activeReservations: 89,
    pendingApprovals: 12,
  }));

  const menuItems = [
    {
      title: 'Restaurants',
      icon: 'restaurant-outline',
      route: '/admin-panel/restaurants',
      color: '#4CAF50',
      description: 'Manage restaurant accounts and approvals',
      stats: {
        value: stats.totalRestaurants,
        label: 'Active',
        trend: '+5%',
        trendUp: true
      }
    },
    {
      title: 'Users',
      icon: 'people-outline',
      route: '/admin-panel/users',
      color: '#2196F3',
      description: 'Manage user accounts and permissions',
      stats: {
        value: stats.totalUsers,
        label: 'Registered',
        trend: '+12%',
        trendUp: true
      }
    },
    {
      title: 'Reservations',
      icon: 'calendar-outline',
      route: '/admin-panel/reservations',
      color: '#FF9800',
      description: 'Monitor and manage reservations',
      stats: {
        value: stats.activeReservations,
        label: 'Active',
        trend: '-3%',
        trendUp: false
      }
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'registration',
      title: 'New Restaurant Registration',
      description: 'Le Petit Bistrot submitted registration',
      time: '2 hours ago',
      icon: 'restaurant-outline',
      color: '#4CAF50'
    },
    {
      id: 2,
      type: 'user',
      title: 'User Report',
      description: 'Multiple complaints about user #1234',
      time: '4 hours ago',
      icon: 'warning-outline',
      color: '#FF9800'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      description: 'Automatic backup completed successfully',
      time: '6 hours ago',
      icon: 'cloud-done-outline',
      color: '#2196F3'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>System Dashboard</Text>
          <Text style={styles.subtitle}>Welcome, Administrator</Text>
        </View>
        <Pressable 
          style={styles.settingsButton}
          onPress={() => router.push('/admin-panel/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#1a1a1a" />
        </Pressable>
      </View>

      <View style={styles.alertSection}>
        <View style={styles.alertCard}>
          <View style={styles.alertIconContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF9800" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Pending Approvals</Text>
            <Text style={styles.alertDescription}>
              {stats.pendingApprovals} new restaurants require your approval
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Quick Overview</Text>
        <View style={styles.statsGrid}>
          {menuItems.map((item) => (
            <Pressable
              key={item.title}
              style={styles.statCard}
              onPress={() => router.push(item.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.statValue}>{item.stats.value}</Text>
              <Text style={styles.statLabel}>{item.stats.label}</Text>
              <View style={[
                styles.trendBadge,
                { backgroundColor: item.stats.trendUp ? '#e8f5e9' : '#ffebee' }
              ]}>
                <Ionicons
                  name={item.stats.trendUp ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={item.stats.trendUp ? '#4CAF50' : '#f44336'}
                />
                <Text style={[
                  styles.trendText,
                  { color: item.stats.trendUp ? '#4CAF50' : '#f44336' }
                ]}>
                  {item.stats.trend}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.activitySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Pressable style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
              <Ionicons name={activity.icon as any} size={24} color={activity.color} />
            </View>
            <View style={styles.activityContent}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <Text style={styles.activityDescription}>{activity.description}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertSection: {
    padding: 20,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#666',
  },
  statsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -10,
  },
  statCard: {
    width: '33.33%',
    padding: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  activitySection: {
    padding: 20,
  },
  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
  },
  viewAllText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
  },
});