import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateUserScore } from './authSlice';

interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellationTime?: string;
}

interface ReservationState {
  reservations: Reservation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  status: 'idle',
  error: null,
};

export const fetchReservations = createAsyncThunk(
  'reservations/fetchAll',
  async (userId: string) => {
    // Simulate API call
    return [
      {
        id: '1',
        restaurantId: '1',
        restaurantName: 'Le Baroque',
        date: new Date().toISOString(),
        time: '20:00',
        guests: 2,
        status: 'confirmed' as const,
      },
      {
        id: '2',
        restaurantId: '2',
        restaurantName: 'Dar El Jeld',
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        time: '19:30',
        guests: 4,
        status: 'pending' as const,
      },
    ];
  }
);

export const createReservation = createAsyncThunk(
  'reservations/create',
  async (reservation: Omit<Reservation, 'id' | 'status'>, { dispatch }) => {
    // Simulate API call
    const newReservation = {
      ...reservation,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
    };

    // Award points for making a reservation
    dispatch(updateUserScore({ points: 100, reliability_score: 0 }));

    return newReservation;
  }
);

export const cancelReservation = createAsyncThunk(
  'reservations/cancel',
  async ({ reservationId, reservation }: { reservationId: string, reservation: Reservation }, { dispatch }) => {
    // Calculate time until reservation
    const reservationTime = new Date(`${reservation.date}T${reservation.time}`);
    const now = new Date();
    const hoursUntilReservation = (reservationTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Apply penalties based on cancellation timing
    let scoreChange = 0;
    let pointsChange = 0;

    if (hoursUntilReservation < 2) {
      // Last-minute cancellation (less than 2 hours)
      scoreChange = -15;
      pointsChange = -200;
    } else if (hoursUntilReservation < 24) {
      // Same-day cancellation
      scoreChange = -5;
      pointsChange = -100;
    } else {
      // Advanced cancellation (more than 24 hours)
      scoreChange = 0;
      pointsChange = -50;
    }

    dispatch(updateUserScore({ points: pointsChange, reliability_score: scoreChange }));

    return {
      ...reservation,
      status: 'cancelled' as const,
      cancellationTime: now.toISOString(),
    };
  }
);

export const completeReservation = createAsyncThunk(
  'reservations/complete',
  async (reservationId: string, { dispatch }) => {
    // Award points and increase reliability score for completing a reservation
    dispatch(updateUserScore({ points: 200, reliability_score: 5 }));

    return reservationId;
  }
);

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch reservations';
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload);
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      .addCase(completeReservation.fulfilled, (state, action) => {
        const reservation = state.reservations.find(r => r.id === action.payload);
        if (reservation) {
          reservation.status = 'completed';
        }
      });
  },
});

export default reservationSlice.reducer;