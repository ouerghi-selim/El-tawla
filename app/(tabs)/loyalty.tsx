import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { 
  fetchLoyaltyStart, 
  fetchLoyaltySuccess, 
  fetchLoyaltyFailure,
  redeemReward,
  LoyaltyReward,
  LoyaltyTransaction
} from '../../store/slices/loyaltySlice';
import { 
  fetchUserLoyaltyPoints, 
  fetchAvailableRewards, 
  redeemLoyaltyReward 
} from '../../utils/loyaltyService';

const LoyaltyScreen = () => {
  const dispatch = useDispatch();
  const { points, history, availableRewards, isLoading, error } = useSelector(
    (state) => state.loyalty
  );
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('rewards');
  const [selectedReward, setSelectedReward] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    if (user) {
      loadLoyaltyData();
    }
  }, [user]);

  const loadLoyaltyData = async () => {
    try {
      dispatch(fetchLoyaltyStart());
      const loyaltyData = await fetchUserLoyaltyPoints(user.id);
      const rewards = await fetchAvailableRewards();
      
      dispatch(fetchLoyaltySuccess(loyaltyData));
      dispatch(updateAvailableRewards(rewards));
    } catch (err) {
      dispatch(fetchLoyaltyFailure(err.message));
    }
  };

  const handleRedeemReward = async (reward) => {
    if (points < reward.pointsRequired) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setIsRedeeming(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await redeemLoyaltyReward(
        user.id,
        reward.id,
        reward.pointsRequired,
        reward.title
      );
      
      dispatch(redeemReward(result));
      setSelectedReward(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Error redeeming reward:', err);
    } finally {
      setIsRedeeming(false);
    }
  };

  const renderRewardItem = ({ item }) => {
    const canRedeem = points >= item.pointsRequired;
    
    return (
      <Pressable
        style={[styles.rewardCard, !canRedeem && styles.rewardCardDisabled]}
        onPress={() => {
          if (canRedeem) {
            setSelectedReward(item);
            Haptics.selectionAsync();
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        }}
      >
        <LinearGradient
          colors={canRedeem ? ['#E3735E', '#D35F4C'] : ['#999', '#777']}
          style={styles.rewardGradient}
        >
          <View style={styles.rewardHeader}>
            <Text style={styles.rewardTitle}>{item.title}</Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>{item.pointsRequired}</Text>
              <Text style={styles.pointsLabel}>points</Text>
            </View>
          </View>
          
          <Text style={styles.rewardDescription}>{item.description}</Text>
          
          <View style={styles.rewardFooter}>
            <Text style={styles.validityText}>
              Valable pendant {item.expiryDays} jours après utilisation
            </Text>
            {canRedeem && (
              <View style={styles.redeemButton}>
                <Text style={styles.redeemButtonText}>Utiliser</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    );
  };

  const renderTransactionItem = ({ item }) => {
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionIconContainer}>
          <Ionicons
            name={item.type === 'earned' ? 'add-circle' : 'remove-circle'}
            size={24}
            color={item.type === 'earned' ? '#4CAF50' : '#E3735E'}
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.date).toLocaleDateString('fr-FR')}
          </Text>
          {item.restaurantName && (
            <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          )}
        </View>
        <Text
          style={[
            styles.transactionPoints,
            item.type === 'earned' ? styles.pointsEarned : styles.pointsRedeemed,
          ]}
        >
          {item.type === 'earned' ? '+' : '-'}{item.points}
        </Text>
      </View>
    );
  };

  const renderRewardConfirmation = () => {
    if (!selectedReward) return null;

    return (
      <View style={styles.confirmationOverlay}>
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationTitle}>Confirmer l'utilisation</Text>
          <Text style={styles.confirmationDescription}>
            Voulez-vous utiliser {selectedReward.pointsRequired} points pour obtenir :
          </Text>
          <Text style={styles.confirmationReward}>{selectedReward.title}</Text>
          <Text style={styles.confirmationDetails}>{selectedReward.description}</Text>
          
          <View style={styles.confirmationButtons}>
            <Pressable
              style={[styles.confirmationButton, styles.cancelButton]}
              onPress={() => {
                setSelectedReward(null);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              disabled={isRedeeming}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[styles.confirmationButton, styles.confirmButton]}
              onPress={() => handleRedeemReward(selectedReward)}
              disabled={isRedeeming}
            >
              {isRedeeming ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirmer</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading && !history.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E3735E" />
        <Text style={styles.loadingText}>Chargement de votre programme de fidélité...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Programme de Fidélité</Text>
        <View style={styles.pointsSummary}>
          <Text style={styles.pointsValue}>{points}</Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'rewards' && styles.activeTab]}
          onPress={() => setActiveTab('rewards')}
        >
          <Text
            style={[styles.tabText, activeTab === 'rewards' && styles.activeTabText]}
          >
            Récompenses
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}
          >
            Historique
          </Text>
        </Pressable>
      </View>

      {activeTab === 'rewards' ? (
        <FlatList
          data={availableRewards}
          renderItem={renderRewardItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.rewardsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="gift-outline" size={48} color="#999" />
              <Text style={styles.emptyStateText}>
                Aucune récompense disponible pour le moment
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={history}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color="#999" />
              <Text style={styles.emptyStateText}>
                Aucune transaction dans votre historique
              </Text>
            </View>
          }
        />
      )}

      {renderRewardConfirmation()}
    </View>
  );
};

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
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pointsSummary: {
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E3735E',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E3735E',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#E3735E',
    fontWeight: '600',
  },
  rewardsList: {
    padding: 16,
  },
  rewardCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rewardCardDisabled: {
    opacity: 0.7,
  },
  rewardGradient: {
    padding: 16,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  pointsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  validityText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  redeemButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  redeemButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  transactionsList: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionIconContainer: {
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  transactionPoints: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsEarned: {
    color: '#4CAF50',
  },
  pointsRedeemed: {
    color: '#E3735E',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmationDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  confirmationReward: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E3735E',
    marginBottom: 8,
  },
  confirmationDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#E3735E',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LoyaltyScreen;
