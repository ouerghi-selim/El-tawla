import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoyaltyState {
  points: number;
  history: LoyaltyTransaction[];
  availableRewards: LoyaltyReward[];
  isLoading: boolean;
  error: string | null;
}

export interface LoyaltyTransaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
  restaurantId?: string;
  restaurantName?: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  discountAmount: number;
  expiryDays: number;
  isAvailable: boolean;
}

const initialState: LoyaltyState = {
  points: 0,
  history: [],
  availableRewards: [
    {
      id: '1',
      title: 'Réduction de 10 DT',
      description: 'Obtenez une réduction de 10 DT sur votre prochaine réservation',
      pointsRequired: 1000,
      discountAmount: 10,
      expiryDays: 90,
      isAvailable: true,
    },
    {
      id: '2',
      title: 'Réduction de 25 DT',
      description: 'Obtenez une réduction de 25 DT sur votre prochaine réservation',
      pointsRequired: 2000,
      discountAmount: 25,
      expiryDays: 90,
      isAvailable: true,
    },
    {
      id: '3',
      title: 'Réduction de 50 DT',
      description: 'Obtenez une réduction de 50 DT sur votre prochaine réservation',
      pointsRequired: 3500,
      discountAmount: 50,
      expiryDays: 90,
      isAvailable: true,
    },
  ],
  isLoading: false,
  error: null,
};

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    fetchLoyaltyStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchLoyaltySuccess(state, action: PayloadAction<{ points: number; history: LoyaltyTransaction[] }>) {
      state.isLoading = false;
      state.points = action.payload.points;
      state.history = action.payload.history;
    },
    fetchLoyaltyFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addPoints(state, action: PayloadAction<{ points: number; transaction: LoyaltyTransaction }>) {
      state.points += action.payload.points;
      state.history.unshift(action.payload.transaction);
    },
    redeemReward(state, action: PayloadAction<{ pointsUsed: number; transaction: LoyaltyTransaction }>) {
      state.points -= action.payload.pointsUsed;
      state.history.unshift(action.payload.transaction);
    },
    updateAvailableRewards(state, action: PayloadAction<LoyaltyReward[]>) {
      state.availableRewards = action.payload;
    },
  },
});

export const {
  fetchLoyaltyStart,
  fetchLoyaltySuccess,
  fetchLoyaltyFailure,
  addPoints,
  redeemReward,
  updateAvailableRewards,
} = loyaltySlice.actions;

export default loyaltySlice.reducer;
