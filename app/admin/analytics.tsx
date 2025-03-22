import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../utils/i18n/LanguageContext';

export default function AdminAnalytics() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'daily', label: t('admin.dailyStats') },
    { id: 'weekly', label: t('admin.weeklyStats') },
    { id: 'monthly', label: t('admin.monthlyStats') },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily':
        return (
          <View style={styles.tabContent}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{t('admin.revenue')}</Text>
              <Text style={styles.statValue}>1,250 TND</Text>
              <Text style={styles.statChange}>+15% {t('admin.fromYesterday')}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{t('admin.customers')}</Text>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statChange}>+8% {t('admin.fromYesterday')}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{t('admin.occupancyRate')}</Text>
              <Text style={styles.statValue}>78%</Text>
              <Text style={styles.statChange}>+5% {t('admin.fromYesterday')}</Text>
            </View>
            
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartTitle}>{t('admin.dailyRevenueChart')}</Text>
              <View style={styles.chart}>
                <Text style={styles.chartLabel}>{t('admin.chartComingSoon')}</Text>
              </View>
            </View>
          </View>
        );
      case 'weekly':
        return (
          <View style={styles.tabContent}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{t('admin.revenue')}</Text>
              <Text style={styles.statValue}>8,450 TND</Text>
              <Text style={styles.statChange}>+10% {t('admin.fromLastWeek')}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{t('admin.customers')}</Text>
              <Text style={styles.statValue}>320</Text>
              <Text style={styles.statChange}>+12% {t('admin.fromLastWeek')}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{t('admin.occupancyRate')}</Text>
              <Text style={styles.statValue}>72%</Text>
              <Text style={styles.statChange}>+3% {t('admin.fromLastWeek')}</Text>
            </View>
            
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartTitle}>{t('admin.weeklyRevenueChart')}</Text>
              <View style={styles.chart}>
                <Text style={styles.chartLabel}>{t('admin.chartComingSoon')}</Text>
              </View>
            </View>
          </View>
        );
      case 'monthly':
        return (
          <View style={styles.tabContent}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{t('admin.revenue')}</Text>
              <Text style={styles.statValue}>35,200 TND</Text>
              <Text style={styles.statChange}>+8% {t('admin.fromLastMonth')}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{t('admin.customers')}</Text>
              <Text style={styles.statValue}>1,250</Text>
              <Text style={styles.statChange}>+15% {t('admin.fromLastMonth')}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{t('admin.occupancyRate')}</Text>
              <Text style={styles.statValue}>68%</Text>
              <Text style={styles.statChange}>+7% {t('admin.fromLastMonth')}</Text>
            </View>
            
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartTitle}>{t('admin.monthlyRevenueChart')}</Text>
              <View style={styles.chart}>
                <Text style={styles.chartLabel}>{t('admin.chartComingSoon')}</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

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
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color="#1a1a1a" />
        </Pressable>
        <Text style={styles.title}>{t('admin.analytics')}</Text>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {renderTabContent()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin.topDishes')}</Text>
        
        <View style={styles.dishItem}>
          <View style={styles.dishRank}>
            <Text style={styles.rankText}>1</Text>
          </View>
          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>Couscous Royal</Text>
            <Text style={styles.dishStats}>250 {t('admin.orders')} • 4.9 ★</Text>
          </View>
          <Text style={styles.dishRevenue}>3,750 TND</Text>
        </View>
        
        <View style={styles.dishItem}>
          <View style={styles.dishRank}>
            <Text style={styles.rankText}>2</Text>
          </View>
          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>Ojja Merguez</Text>
            <Text style={styles.dishStats}>180 {t('admin.orders')} • 4.8 ★</Text>
          </View>
          <Text style={styles.dishRevenue}>2,520 TND</Text>
        </View>
        
        <View style={styles.dishItem}>
          <View style={styles.dishRank}>
            <Text style={styles.rankText}>3</Text>
          </View>
          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>Brik à l'œuf</Text>
            <Text style={styles.dishStats}>210 {t('admin.orders')} • 4.7 ★</Text>
          </View>
          <Text style={styles.dishRevenue}>1,890 TND</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin.staffPerformance')}</Text>
        
        <View style={styles.staffItem}>
          <View style={[styles.staffAvatar, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.staffInitials}>SM</Text>
          </View>
          <View style={styles.staffInfo}>
            <Text style={styles.staffName}>Sami Mansour</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.staffRating}>4.9 ★</Text>
              <Text style={styles.staffStats}>• 120 {t('admin.servedTables')}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.staffItem}>
          <View style={[styles.staffAvatar, { backgroundColor: '#2196F3' }]}>
            <Text style={styles.staffInitials}>LB</Text>
          </View>
          <View style={styles.staffInfo}>
            <Text style={styles.staffName}>Leila Ben Ali</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.staffRating}>4.8 ★</Text>
              <Text style={styles.staffStats}>• 105 {t('admin.servedTables')}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.staffItem}>
          <View style={[styles.staffAvatar, { backgroundColor: '#FF9800' }]}>
            <Text style={styles.staffInitials}>KT</Text>
          </View>
          <View style={styles.staffInfo}>
            <Text style={styles.staffName}>Karim Trabelsi</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.staffRating}>4.7 ★</Text>
              <Text style={styles.staffStats}>• 98 {t('admin.servedTables')}</Text>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#E3735E',
    fontWeight: '600',
  },
  tabContent: {
    padding: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  statChange: {
    fontSize: 14,
    color: '#4CAF50',
  },
  chartPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  chart: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  dishItem: {
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
  dishRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E3735E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  dishStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dishRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E3735E',
  },
  staffItem: {
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
  staffAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  staffInitials: {
    color: '#fff',
    fontWeight: 'bold',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  staffRating: {
    fontSize: 14,
    color: '#FFC107',
    fontWeight: '600',
  },
  staffStats: {
    fontSize: 14,
    color: '#666',
  },
});
