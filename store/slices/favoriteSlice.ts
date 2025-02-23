import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';

interface FavoriteState {
  favorites: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FavoriteState = {
  favorites: [],
  status: 'idle',
  error: null,
};

export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async () => {
    const favoritesStr = await storage.getItem('favorites');
    return favoritesStr ? JSON.parse(favoritesStr) : [];
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async (restaurantId: string, { getState }) => {
    const { favorites } = (getState() as any).favorites;
    const newFavorites = favorites.includes(restaurantId)
      ? favorites.filter((id: string) => id !== restaurantId)
      : [...favorites, restaurantId];
    
    await storage.setItem('favorites', JSON.stringify(newFavorites));
    return newFavorites;
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.status = 'succeeded';
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export default favoriteSlice.reducer;