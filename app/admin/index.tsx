import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../utils/i18n/LanguageContext';
import { supabase } from '../../supabase/client';

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayReservations: 0,
    pendingReservations: 0,
    totalTables: 0,
    availableTables: 0,
    revenue: 0,
    totalCustomers: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // In a real implementation, these would be actual Supabase queries
      // For now, we'll simulate the data loading with a timeout
      setTimeout(() => {
        setStats({
          todayReservations: 12,
          pendingReservations: 5,
          totalTables: 20,
          availableTables: 8,
          revenue: 1250,
          totalCustomers: 45,
        });
        
        setRecentActivity([
          {
            id: 1,
            type: 'reservation',
            title: t('admin.newReservation'),
            time: '2 hours ago',
            icon: 'calendar-outline',
            color: '#2196F3'
          },
          {
            id: 2,
            type: 'review',
            title: t('admin.newReview'),
            time: '4 hours ago',
            icon: 'star-outline',
            color: '#FFC107'
          },
          {
            id: 3,
            type: 'order',
            title: t('admin.newOrder'),
            time: '5 hours ago',
            icon: 'cart-outline',
            color: '#4CAF50'
          }
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: t('admin.menuManagement'),
      icon: 'restaurant-outline',
      route: '/admin/menu',
      color: '#4CAF50',
    },
    {
      title: t('admin.reservations'),
      icon: 'calendar-outline',
      route: '/admin/reservations',
      color: '#2196F3',
    },
    {
      title: t('admin.settings'),
      icon: 'settings-outline',
      route: '/admin/settings',
      color: '#9C27B0',
    },
    {
      title: t('admin.analytics'),
      icon: 'bar-chart-outline',
      route: '/admin/analytics',
      color: '#FF9800',
    },
    {
      title: t('admin.staff'),
      icon: 'people-outline',
      route: '/admin/staff',
      color: '#795548',
    },
    {
      title: t('admin.promotions'),
      icon: 'pricetag-outline',
      route: '/admin/promotions',
      color: '#E91E63',
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E3735E" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{t('admin.welcomeBack')}</Text>
        <Text style={styles.subtitle}>{t('admin.restaurantOverview')}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.todayReservations}</Text>
          <Text style={styles.statLabel}>{t('admin.todayReservations')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pendingReservations}</Text>
          <Text style={styles.statLabel}>{t('admin.pendingReservations')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.availableTables}/{stats.totalTables}</Text>
          <Text style={styles.statLabel}>{t('admin.availableTables')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.revenue} TND</Text>
          <Text style={styles.statLabel}>{t('admin.todayRevenue')}</Text>
        </View>
      </View>

      <View style={[styles.menuSection, isRTL && styles.menuSectionRTL]}>
        <Text style={styles.sectionTitle}>{t('admin.quickActions')}</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <Pressable
              key={item.title}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.section, isRTL && styles.sectionRTL]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('admin.recentActivity')}</Text>
          <Pressable onPress={() => router.push('/admin/activity')}>
            <Text style={styles.viewAllText}>{t('admin.viewAll')}</Text>
          </Pressable>
        </View>
        
        {recentActivity.map((activity) => (
          <View key={activity.id} style={[styles.activityItem, isRTL && styles.activityItemRTL]}>
            <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
              <Ionicons name={activity.icon as any} size={20} color={activity.color} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
            <Ionicons 
              name={isRTL ? "chevron-back" : "chevron-forward"} 
              size={20} 
              color="#666" 
            />
          </View>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{t('admin.customerSummary')}</Text>
        <View style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{stats.totalCustomers}</Text>
            <Text style={styles.summaryLabel}>{t('admin.totalCustomers')}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>4.8</Text>
            <Text style={styles.summaryLabel}>{t('admin.averageRating')}</Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E3735E',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  menuSection: {
    padding: 20,
  },
  menuSectionRTL: {
    direction: 'rtl',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemTitle: {
    fontSize: 14,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionRTL: {
    direction: 'rtl',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#E3735E',
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  activityItemRTL: {
    flexDirection: 'row-reverse',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  summaryCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E3735E',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
});
