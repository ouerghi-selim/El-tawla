import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface StatCard {
  title: string;
  value: number;
  trend: string;
  trendUp: boolean;
  icon: string;
  color: string;
}

interface ChartData {
  labels: string[];
  data: number[];
}

export default function StatisticsScreen() {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: 15420,
      trend: '+12%',
      trendUp: true,
      icon: 'cash-outline',
      color: '#4CAF50'
    },
    {
      title: 'Active Users',
      value: 856,
      trend: '+8%',
      trendUp: true,
      icon: 'people-outline',
      color: '#2196F3'
    },
    {
      title: 'Reservations',
      value: 234,
      trend: '-3%',
      trendUp: false,
      icon: 'calendar-outline',
      color: '#FF9800'
    },
    {
      title: 'Average Rating',
      value: 4.8,
      trend: '+0.2',
      trendUp: true,
      icon: 'star-outline',
      color: '#9C27B0'
    }
  ];

  const topRestaurants = [
    {
      name: 'Le Baroque',
      reservations: 156,
      rating: 4.8,
      revenue: 8500
    },
    {
      name: 'Dar El Jeld',
      reservations: 142,
      rating: 4.9,
      revenue: 7800
    },
    {
      name: 'La Terrasse',
      reservations: 98,
      rating: 4.7,
      revenue: 5600
    }
  ];

  const recentTransactions = [
    {
      id: '1',
      restaurant: 'Le Baroque',
      amount: 450,
      type: 'reservation',
      date: '2025-02-20 19:30',
      status: 'completed'
    },
    {
      id: '2',
      restaurant: 'Dar El Jeld',
      amount: 380,
      type: 'reservation',
      date: '2025-02-20 20:00',
      status: 'pending'
    },
    {
      id: '3',
      restaurant: 'La Terrasse',
      amount: 250,
      type: 'cancellation',
      date: '2025-02-20 15:45',
      status: 'refunded'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <View style={styles.timeframeSelector}>
          <Pressable
            style={[styles.timeframeButton, timeframe === 'day' && styles.activeTimeframe]}
            onPress={() => setTimeframe('day')}
          >
            <Text style={[styles.timeframeText, timeframe === 'day' && styles.activeTimeframeText]}>
              Day
            </Text>
          </Pressable>
          <Pressable
            style={[styles.timeframeButton, timeframe === 'week' && styles.activeTimeframe]}
            onPress={() => setTimeframe('week')}
          >
            <Text style={[styles.timeframeText, timeframe === 'week' && styles.activeTimeframeText]}>
              Week
            </Text>
          </Pressable>
          <Pressable
            style={[styles.timeframeButton, timeframe === 'month' && styles.activeTimeframe]}
            onPress={() => setTimeframe('month')}
          >
            <Text style={[styles.timeframeText, timeframe === 'month' && styles.activeTimeframeText]}>
              Month
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.title} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            </View>
            <Text style={styles.statTitle}>{stat.title}</Text>
            <Text style={styles.statValue}>
              {typeof stat.value === 'number' && stat.title === 'Total Revenue' 
                ? stat.value.toLocaleString() + ' TND'
                : stat.value}
            </Text>
            <View style={[
              styles.trendBadge,
              { backgroundColor: stat.trendUp ? '#e8f5e9' : '#ffebee' }
            ]}>
              <Ionicons
                name={stat.trendUp ? 'trending-up' : 'trending-down'}
                size={16}
                color={stat.trendUp ? '#4CAF50' : '#F44336'}
              />
              <Text style={[
                styles.trendText,
                { color: stat.trendUp ? '#4CAF50' : '#F44336' }
              ]}>
                {stat.trend}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Performing Restaurants</Text>
          <Pressable style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>
        {topRestaurants.map((restaurant, index) => (
          <View key={restaurant.name} style={styles.restaurantCard}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <View style={styles.restaurantStats}>
                <View style={styles.statBadge}>
                  <Ionicons name="calendar" size={16} color="#666" />
                  <Text style={styles.statBadgeText}>{restaurant.reservations}</Text>
                </View>
                <View style={styles.statBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.statBadgeText}>{restaurant.rating}</Text>
                </View>
                <View style={styles.statBadge}>
                  <Ionicons name="cash" size={16} color="#4CAF50" />
                  <Text style={styles.statBadgeText}>{restaurant.revenue} TND</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Pressable style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>
        {recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={[
              styles.transactionIcon,
              { backgroundColor: transaction.type === 'reservation' ? '#e8f5e9' : '#ffebee' }
            ]}>
              <Ionicons
                name={transaction.type === 'reservation' ? 'calendar' : 'close-circle'}
                size={24}
                color={transaction.type === 'reservation' ? '#4CAF50' : '#F44336'}
              />
            </View>
            <View style={styles.transactionInfo}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionRestaurant}>{transaction.restaurant}</Text>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'reservation' ? '#4CAF50' : '#F44336' }
                ]}>
                  {transaction.type === 'reservation' ? '+' : '-'}{transaction.amount} TND
                </Text>
              </View>
              <View style={styles.transactionFooter}>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleString()}
                </Text>
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor: 
                      transaction.status === 'completed' ? '#e8f5e9' :
                      transaction.status === 'pending' ? '#fff3e0' : '#ffebee'
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    {
                      color:
                        transaction.status === 'completed' ? '#4CAF50' :
                        transaction.status === 'pending' ? '#FF9800' : '#F44336'
                    }
                  ]}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Text>
                </View>
              </View>
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
    marginBottom: 15,
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTimeframe: {
    backgroundColor: '#E3735E',
  },
  timeframeText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTimeframeText: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '50%',
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
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
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
  section: {
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
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  restaurantStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statBadgeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  transactionCard: {
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
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionRestaurant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});