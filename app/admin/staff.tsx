import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../utils/i18n/LanguageContext';

export default function StaffManagement() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setStaff([
        {
          id: 1,
          name: 'Sami Mansour',
          role: t('admin.waiter'),
          rating: 4.9,
          servedTables: 120,
          avatar: 'SM',
          color: '#4CAF50'
        },
        {
          id: 2,
          name: 'Leila Ben Ali',
          role: t('admin.hostess'),
          rating: 4.8,
          servedTables: 105,
          avatar: 'LB',
          color: '#2196F3'
        },
        {
          id: 3,
          name: 'Karim Trabelsi',
          role: t('admin.waiter'),
          rating: 4.7,
          servedTables: 98,
          avatar: 'KT',
          color: '#FF9800'
        },
        {
          id: 4,
          name: 'Fatma Riahi',
          role: t('admin.chef'),
          rating: 4.9,
          servedTables: 0,
          avatar: 'FR',
          color: '#E91E63'
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
        <Text style={styles.title}>{t('admin.staff')}</Text>
      </View>

      <View style={styles.actionBar}>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>{t('admin.addStaff')}</Text>
        </Pressable>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('admin.searchStaff')}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin.staffMembers')}</Text>
        
        {staff.map((member) => (
          <Pressable 
            key={member.id} 
            style={styles.staffCard}
            onPress={() => router.push(`/admin/staff/${member.id}`)}
          >
            <View style={[styles.staffAvatar, { backgroundColor: member.color }]}>
              <Text style={styles.staffInitials}>{member.avatar}</Text>
            </View>
            
            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>{member.name}</Text>
              <Text style={styles.staffRole}>{member.role}</Text>
              
              <View style={styles.staffStats}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#FFC107" />
                  <Text style={styles.statText}>{member.rating}</Text>
                </View>
                
                {member.role !== t('admin.chef') && (
                  <View style={styles.statItem}>
                    <Ionicons name="restaurant-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{member.servedTables}</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.staffActions}>
              <Pressable style={styles.actionButton}>
                <Ionicons name="create-outline" size={20} color="#666" />
              </Pressable>
              
              <Pressable style={styles.actionButton}>
                <Ionicons name="trash-outline" size={20} color="#dc3545" />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin.schedules')}</Text>
        
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>{t('admin.todaySchedule')}</Text>
            <Pressable>
              <Text style={styles.scheduleAction}>{t('admin.viewAll')}</Text>
            </Pressable>
          </View>
          
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>08:00 - 16:00</Text>
            </View>
            <View style={styles.scheduleStaff}>
              <Text style={styles.scheduleStaffName}>Sami Mansour</Text>
              <Text style={styles.scheduleStaffRole}>{t('admin.waiter')}</Text>
            </View>
          </View>
          
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>08:00 - 16:00</Text>
            </View>
            <View style={styles.scheduleStaff}>
              <Text style={styles.scheduleStaffName}>Leila Ben Ali</Text>
              <Text style={styles.scheduleStaffRole}>{t('admin.hostess')}</Text>
            </View>
          </View>
          
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>16:00 - 00:00</Text>
            </View>
            <View style={styles.scheduleStaff}>
              <Text style={styles.scheduleStaffName}>Karim Trabelsi</Text>
              <Text style={styles.scheduleStaffRole}>{t('admin.waiter')}</Text>
            </View>
          </View>
          
          <Pressable style={styles.addScheduleButton}>
            <Ionicons name="add-circle-outline" size={20} color="#E3735E" />
            <Text style={styles.addScheduleText}>{t('admin.addShift')}</Text>
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
    marginRight: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
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
  staffCard: {
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
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  staffInitials: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  staffRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  staffStats: {
    flexDirection: 'row',
    marginTop: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  staffActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scheduleAction: {
    fontSize: 14,
    color: '#E3735E',
    fontWeight: '500',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scheduleTime: {
    width: 100,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  scheduleStaff: {
    flex: 1,
  },
  scheduleStaffName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  scheduleStaffRole: {
    fontSize: 12,
    color: '#666',
  },
  addScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  addScheduleText: {
    fontSize: 14,
    color: '#E3735E',
    fontWeight: '500',
    marginLeft: 5,
  },
});
