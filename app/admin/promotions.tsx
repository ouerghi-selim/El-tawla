import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../utils/i18n/LanguageContext';

export default function PromotionsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setPromotions([
        {
          id: 1,
          title: t('admin.happyHour'),
          description: t('admin.happyHourDesc'),
          discount: '20%',
          startDate: '2025-03-15',
          endDate: '2025-04-15',
          active: true,
          color: '#4CAF50'
        },
        {
          id: 2,
          title: t('admin.weekendSpecial'),
          description: t('admin.weekendSpecialDesc'),
          discount: '15%',
          startDate: '2025-03-20',
          endDate: '2025-05-30',
          active: true,
          color: '#2196F3'
        },
        {
          id: 3,
          title: t('admin.ramadanOffer'),
          description: t('admin.ramadanOfferDesc'),
          discount: '25%',
          startDate: '2025-04-01',
          endDate: '2025-05-01',
          active: false,
          color: '#FF9800'
        }
      ]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [t]);

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
        <Text style={styles.title}>{t('admin.promotions')}</Text>
      </View>

      <View style={styles.actionBar}>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>{t('admin.addPromotion')}</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin.activePromotions')}</Text>
        
        {promotions.filter(promo => promo.active).map((promotion) => (
          <View key={promotion.id} style={styles.promotionCard}>
            <View style={[styles.promotionBadge, { backgroundColor: promotion.color }]}>
              <Text style={styles.discountText}>{promotion.discount}</Text>
            </View>
            
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>{promotion.title}</Text>
              <Text style={styles.promotionDescription}>{promotion.description}</Text>
              
              <View style={styles.promotionDates}>
                <Text style={styles.dateText}>
                  {promotion.startDate} - {promotion.endDate}
                </Text>
              </View>
            </View>
            
            <View style={styles.promotionActions}>
              <Pressable style={styles.actionButton}>
                <Ionicons name="create-outline" size={20} color="#666" />
              </Pressable>
              
              <Pressable style={styles.actionButton}>
                <Ionicons name="trash-outline" size={20} color="#dc3545" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin.upcomingPromotions')}</Text>
        
        {promotions.filter(promo => !promo.active).map((promotion) => (
          <View key={promotion.id} style={styles.promotionCard}>
            <View style={[styles.promotionBadge, { backgroundColor: promotion.color + '80' }]}>
              <Text style={styles.discountText}>{promotion.discount}</Text>
            </View>
            
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>{promotion.title}</Text>
              <Text style={styles.promotionDescription}>{promotion.description}</Text>
              
              <View style={styles.promotionDates}>
                <Text style={styles.dateText}>
                  {promotion.startDate} - {promotion.endDate}
                </Text>
              </View>
            </View>
            
            <View style={styles.promotionActions}>
              <Pressable style={styles.actionButton}>
                <Ionicons name="create-outline" size={20} color="#666" />
              </Pressable>
              
              <Pressable style={styles.actionButton}>
                <Ionicons name="trash-outline" size={20} color="#dc3545" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin.loyaltySettings')}</Text>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('admin.pointsPerDinar')}</Text>
              <Text style={styles.settingDescription}>{t('admin.pointsPerDinarDesc')}</Text>
            </View>
            <TextInput
              style={styles.settingInput}
              keyboardType="numeric"
              defaultValue="1"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('admin.pointsForReservation')}</Text>
              <Text style={styles.settingDescription}>{t('admin.pointsForReservationDesc')}</Text>
            </View>
            <TextInput
              style={styles.settingInput}
              keyboardType="numeric"
              defaultValue="50"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('admin.enableLoyalty')}</Text>
              <Text style={styles.settingDescription}>{t('admin.enableLoyaltyDesc')}</Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: '#e0e0e0', true: '#E3735E' }}
              thumbColor={'#fff'}
            />
          </View>
          
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveButtonText}>{t('common.save')}</Text>
          </Pressable>
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
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3735E',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 5,
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
  promotionCard: {
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
  promotionBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  promotionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  promotionDates: {
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  promotionActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  settingInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  saveButton: {
    backgroundColor: '#E3735E',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
