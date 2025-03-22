import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Mise à jour du store pour inclure le slice de fidélité
export const store = configureStore({
  reducer: {
    // Autres reducers existants
    auth: authReducer,
    restaurants: restaurantsReducer,
    reservations: reservationsReducer,
    // Ajout du nouveau reducer de fidélité
    loyalty: loyaltyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Type pour le RootState
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
