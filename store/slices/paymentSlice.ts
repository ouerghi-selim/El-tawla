import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabase/client';
import { stripeApi } from '../utils/paymentService';

// Thunks
export const fetchPaymentMethods = createAsyncThunk(
  'payment/fetchPaymentMethods',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPaymentMethod = createAsyncThunk(
  'payment/addPaymentMethod',
  async ({ userId, paymentDetails }, { rejectWithValue }) => {
    try {
      // Create payment method with Stripe
      const { paymentMethod, error: stripeError } = await stripeApi.createPaymentMethod({
        type: 'card',
        card: {
          number: paymentDetails.cardNumber,
          exp_month: paymentDetails.expMonth,
          exp_year: paymentDetails.expYear,
          cvc: paymentDetails.cvc,
        },
        billing_details: {
          name: paymentDetails.cardholderName,
        },
      });
      
      if (stripeError) throw stripeError;
      
      // Save payment method to database
      const { data, error } = await supabase
        .from('user_payment_methods')
        .insert({
          user_id: userId,
          payment_provider: 'stripe',
          payment_method_id: paymentMethod.id,
          card_last_four: paymentDetails.cardNumber.slice(-4),
          card_brand: paymentMethod.card.brand,
          card_exp_month: paymentDetails.expMonth,
          card_exp_year: paymentDetails.expYear,
          is_default: paymentDetails.isDefault,
        })
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removePaymentMethod = createAsyncThunk(
  'payment/removePaymentMethod',
  async ({ paymentMethodId, stripePaymentMethodId }, { rejectWithValue }) => {
    try {
      // Detach payment method from Stripe
      const { error: stripeError } = await stripeApi.detachPaymentMethod(stripePaymentMethodId);
      
      if (stripeError) throw stripeError;
      
      // Remove payment method from database
      const { error } = await supabase
        .from('user_payment_methods')
        .delete()
        .eq('id', paymentMethodId);
      
      if (error) throw error;
      
      return paymentMethodId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  'payment/setDefaultPaymentMethod',
  async ({ userId, paymentMethodId }, { rejectWithValue }) => {
    try {
      // First, set all payment methods to non-default
      const { error: updateError } = await supabase
        .from('user_payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // Then, set the selected payment method as default
      const { data, error } = await supabase
        .from('user_payment_methods')
        .update({ is_default: true })
        .eq('id', paymentMethodId)
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const processPayment = createAsyncThunk(
  'payment/processPayment',
  async ({ amount, currency, paymentMethodId, description, metadata }, { rejectWithValue }) => {
    try {
      // Create payment intent with Stripe
      const { paymentIntent, error: intentError } = await stripeApi.createPaymentIntent({
        amount,
        currency,
        payment_method: paymentMethodId,
        description,
        metadata,
        confirm: true,
      });
      
      if (intentError) throw intentError;
      
      // Save payment record to database
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: metadata.userId,
          amount,
          currency,
          payment_method_id: paymentMethodId,
          payment_intent_id: paymentIntent.id,
          status: paymentIntent.status,
          description,
          metadata,
        })
        .select();
      
      if (error) throw error;
      
      return {
        payment: data[0],
        paymentIntent,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'payment/fetchPaymentHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    paymentMethods: [],
    paymentHistory: [],
    currentPayment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    resetCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPaymentMethods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // addPaymentMethod
      .addCase(addPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods.push(action.payload);
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // removePaymentMethod
      .addCase(removePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = state.paymentMethods.filter(
          method => method.id !== action.payload
        );
      })
      .addCase(removePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // setDefaultPaymentMethod
      .addCase(setDefaultPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = state.paymentMethods.map(method => ({
          ...method,
          is_default: method.id === action.payload.id
        }));
      })
      .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // processPayment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPayment = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        state.paymentHistory.unshift(action.payload.payment);
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchPaymentHistory
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPaymentError, resetCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
