import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  reliability_score: number;
  type: 'customer' | 'restaurant';
  badges: string[];
  score_threshold?: number;
  score_enabled?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  type: 'customer' | 'restaurant';
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials) => {
    // Simulate API call
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: credentials.name,
      points: 0,
      reliability_score: 100,
      type: 'customer' as const,
      badges: ['New Member'],
    };
    const mockToken = 'mock-jwt-token';
    
    await storage.setItem('token', mockToken);
    await storage.setItem('user', JSON.stringify(mockUser));
    
    return { user: mockUser, token: mockToken };
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    // Simulate API call
    const mockUser = {
      id: '1',
      email: credentials.email,
      name: credentials.type === 'restaurant' ? 'Le Baroque' : 'John Doe',
      points: credentials.type === 'customer' ? 2500 : 0,
      reliability_score: 95,
      type: credentials.type,
      badges: ['Regular', 'Punctual'],
      score_threshold: credentials.type === 'restaurant' ? 70 : undefined,
      score_enabled: credentials.type === 'restaurant' ? true : undefined,
    };
    const mockToken = 'mock-jwt-token';
    
    await storage.setItem('token', mockToken);
    await storage.setItem('user', JSON.stringify(mockUser));
    
    return { user: mockUser, token: mockToken };
  }
);

export const updateScoreSettings = createAsyncThunk(
  'auth/updateScoreSettings',
  async ({ threshold, enabled }: { threshold: number; enabled: boolean }, { getState }) => {
    const { user } = (getState() as any).auth;
    if (!user || user.type !== 'restaurant') throw new Error('Unauthorized');

    const updatedUser = {
      ...user,
      score_threshold: threshold,
      score_enabled: enabled,
    };

    await storage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
);

export const updateUserScore = createAsyncThunk(
  'auth/updateScore',
  async ({ points, reliability_score }: { points: number; reliability_score: number }, { getState }) => {
    const { user } = (getState() as any).auth;
    if (!user) throw new Error('No user logged in');

    const updatedUser = {
      ...user,
      points: user.points + points,
      reliability_score: Math.max(0, Math.min(100, user.reliability_score + reliability_score)),
    };

    // Update badges based on new score
    const badges = [...user.badges];
    if (updatedUser.reliability_score >= 95 && !badges.includes('Reliable')) {
      badges.push('Reliable');
    }
    if (updatedUser.points >= 5000 && !badges.includes('Gold Member')) {
      badges.push('Gold Member');
    }
    updatedUser.badges = badges;

    await storage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await storage.removeItem('token');
  await storage.removeItem('user');
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const [token, userStr] = await Promise.all([
    storage.getItem('token'),
    storage.getItem('user'),
  ]);
  
  if (token && userStr) {
    const user = JSON.parse(userStr);
    return { user, token };
  }
  throw new Error('No valid session found');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
      })
      .addCase(updateUserScore.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateScoreSettings.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;