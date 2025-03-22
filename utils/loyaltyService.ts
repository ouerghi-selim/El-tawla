import { supabase } from '../supabase/client';
import { LoyaltyTransaction, LoyaltyReward } from '../store/slices/loyaltySlice';

export const fetchUserLoyaltyPoints = async (userId: string) => {
  try {
    // Fetch user's loyalty points
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('loyalty_points')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Fetch user's loyalty transactions history
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (transactionsError) throw transactionsError;

    // Transform the data to match our frontend model
    const transactions: LoyaltyTransaction[] = transactionsData.map(transaction => ({
      id: transaction.id,
      date: transaction.created_at,
      description: transaction.description,
      points: transaction.points,
      type: transaction.type,
      restaurantId: transaction.restaurant_id,
      restaurantName: transaction.restaurant_name
    }));

    return {
      points: userData.loyalty_points || 0,
      history: transactions
    };
  } catch (error) {
    console.error('Error fetching loyalty data:', error);
    throw error;
  }
};

export const addLoyaltyPoints = async (
  userId: string,
  points: number,
  description: string,
  restaurantId?: string,
  restaurantName?: string
) => {
  try {
    // Start a transaction
    const { error: transactionError } = await supabase.rpc('add_loyalty_points', {
      p_user_id: userId,
      p_points: points,
      p_description: description,
      p_restaurant_id: restaurantId,
      p_restaurant_name: restaurantName
    });

    if (transactionError) throw transactionError;

    // Get the latest transaction to return
    const { data: latestTransaction, error: fetchError } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) throw fetchError;

    return {
      points,
      transaction: {
        id: latestTransaction.id,
        date: latestTransaction.created_at,
        description,
        points,
        type: 'earned',
        restaurantId,
        restaurantName
      }
    };
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    throw error;
  }
};

export const redeemLoyaltyReward = async (
  userId: string,
  rewardId: string,
  pointsRequired: number,
  rewardTitle: string
) => {
  try {
    // Check if user has enough points
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('loyalty_points')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    
    if (userData.loyalty_points < pointsRequired) {
      throw new Error('Not enough loyalty points');
    }

    // Start a transaction to redeem points
    const { error: transactionError } = await supabase.rpc('redeem_loyalty_points', {
      p_user_id: userId,
      p_points: pointsRequired,
      p_description: `Récompense utilisée: ${rewardTitle}`,
      p_reward_id: rewardId
    });

    if (transactionError) throw transactionError;

    // Get the latest transaction to return
    const { data: latestTransaction, error: fetchError } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) throw fetchError;

    return {
      pointsUsed: pointsRequired,
      transaction: {
        id: latestTransaction.id,
        date: latestTransaction.created_at,
        description: `Récompense utilisée: ${rewardTitle}`,
        points: pointsRequired,
        type: 'redeemed'
      }
    };
  } catch (error) {
    console.error('Error redeeming loyalty reward:', error);
    throw error;
  }
};

export const fetchAvailableRewards = async () => {
  try {
    const { data, error } = await supabase
      .from('loyalty_rewards')
      .select('*')
      .eq('is_active', true)
      .order('points_required', { ascending: true });

    if (error) throw error;

    // Transform the data to match our frontend model
    const rewards: LoyaltyReward[] = data.map(reward => ({
      id: reward.id,
      title: reward.title,
      description: reward.description,
      pointsRequired: reward.points_required,
      discountAmount: reward.discount_amount,
      expiryDays: reward.expiry_days,
      isAvailable: true
    }));

    return rewards;
  } catch (error) {
    console.error('Error fetching available rewards:', error);
    throw error;
  }
};
