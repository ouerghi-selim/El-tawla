import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../utils/supabase';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
//import * as SocialMedia from 'expo-social-media';

// Thunks
export const fetchUserSocialProfile = createAsyncThunk(
  'social/fetchUserSocialProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_social_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserFriends = createAsyncThunk(
  'social/fetchUserFriends',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_friends')
        .select(`
          friend_id,
          users!friend_id (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Transform data to get just the friend user objects
      return data.map(item => item.users);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserFavorites = createAsyncThunk(
  'social/fetchUserFavorites',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          restaurant_id,
          restaurants (
            id,
            name,
            cover_image,
            city,
            cuisine_types
          ),
          created_at
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Transform data to include restaurant info directly
      return data.map(item => ({
        id: item.id,
        restaurant: item.restaurants,
        created_at: item.created_at
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'social/addToFavorites',
  async ({ userId, restaurantId }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          restaurant_id: restaurantId
        })
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'social/removeFromFavorites',
  async (favoriteId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);
      
      if (error) throw error;
      return favoriteId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const shareReservation = createAsyncThunk(
  'social/shareReservation',
  async ({ reservationId, platform }, { rejectWithValue }) => {
    try {
      // Fetch reservation details
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .select(`
          id,
          date,
          time,
          party_size,
          restaurants (
            id,
            name,
            address,
            city,
            phone
          )
        `)
        .eq('id', reservationId)
        .single();
      
      if (reservationError) throw reservationError;
      
      // Create share message
      const message = `J'ai réservé une table chez ${reservation.restaurants.name} pour ${reservation.party_size} personnes le ${reservation.date} à ${reservation.time}. Rejoins-moi via El Tawla!`;
      
      // Share based on platform
    /*  if (platform === 'whatsapp') {
        await SocialMedia.shareViaWhatsApp(message);
      } else if (platform === 'facebook') {
        await SocialMedia.shareViaFacebook(message);
      } else if (platform === 'twitter') {
        await SocialMedia.shareViaTwitter(message);
      } else if (platform === 'email') {
        await SocialMedia.shareViaEmail(
          'Réservation chez ' + reservation.restaurants.name,
          message
        );
      } else {*/
        // Default share
        await Sharing.shareAsync(
          FileSystem.documentDirectory + 'reservation.txt',
          { 
            mimeType: 'text/plain',
            dialogTitle: 'Partager ma réservation',
            UTI: 'public.plain-text' 
          }
        );
     // }
      
      // Log the share activity
      const { data: activity, error: activityError } = await supabase
        .from('user_activities')
        .insert({
          user_id: reservation.user_id,
          activity_type: 'share_reservation',
          reference_id: reservationId,
          platform: platform
        })
        .select();
      
      if (activityError) throw activityError;
      
      return { success: true, activity: activity[0] };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const recommendRestaurant = createAsyncThunk(
  'social/recommendRestaurant',
  async ({ userId, restaurantId, friendIds, message }, { rejectWithValue }) => {
    try {
      // Create recommendations for each friend
      const recommendations = friendIds.map(friendId => ({
        sender_id: userId,
        receiver_id: friendId,
        restaurant_id: restaurantId,
        message: message,
        status: 'pending'
      }));
      
      const { data, error } = await supabase
        .from('restaurant_recommendations')
        .insert(recommendations)
        .select();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const socialSlice = createSlice({
  name: 'social',
  initialState: {
    profile: null,
    friends: [],
    favorites: [],
    recommendations: {
      sent: [],
      received: []
    },
    activities: [],
    loading: false,
    error: null
  },
  reducers: {
    clearSocialError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserSocialProfile
      .addCase(fetchUserSocialProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSocialProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserSocialProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchUserFriends
      .addCase(fetchUserFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(fetchUserFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchUserFavorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // addToFavorites
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.loading = false;
        // We would need to fetch the full restaurant details to add it properly
        // This is a simplified version
        state.favorites.push(action.payload);
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // removeFromFavorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // shareReservation
      .addCase(shareReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareReservation.fulfilled, (state, action) => {
        state.loading = false;
        // Could add the activity to a list if needed
      })
      .addCase(shareReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // recommendRestaurant
      .addCase(recommendRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recommendRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations.sent = [...state.recommendations.sent, ...action.payload];
      })
      .addCase(recommendRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSocialError } = socialSlice.actions;
export default socialSlice.reducer;
