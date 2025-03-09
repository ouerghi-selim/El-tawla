import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase, type Profile } from '../../utils/supabase';
import { storage } from '../../utils/storage';

interface AuthState {
  user: Profile | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { name: string; email: string; password: string }) => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (signUpError) throw new Error(signUpError.message);
    if (!authData.user) throw new Error('Registration failed');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email: credentials.email,
        name: credentials.name,
        type: 'customer',
      }]);

    if (profileError) throw new Error(profileError.message);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    return {
      user: profile,
      token: authData.session?.access_token || null,
    };
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string; type: 'customer' | 'restaurant' | 'admin' }) => {
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (signInError) throw new Error(signInError.message);
    if (!authData.user) throw new Error('Login failed');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .eq('type', credentials.type)
      .single();

    if (profileError) throw new Error('Invalid credentials for this user type');

    return {
      user: profile,
      token: authData.session?.access_token || null,
    };
  }
);

export const updateScoreSettings = createAsyncThunk(
  'auth/updateScoreSettings',
  async ({ threshold, enabled }: { threshold: number; enabled: boolean }, { getState }) => {
    const { user } = (getState() as any).auth;
    if (!user || user.type !== 'restaurant') throw new Error('Unauthorized');

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        score_threshold: threshold,
        score_enabled: enabled,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return profile;
  }
);

export const updateUserScore = createAsyncThunk(
  'auth/updateScore',
  async ({ points, reliability_score }: { points: number; reliability_score: number }, { getState }) => {
    const { user } = (getState() as any).auth;
    if (!user) throw new Error('No user logged in');

    const newReliabilityScore = Math.max(0, Math.min(100, user.reliability_score + reliability_score));
    const newPoints = user.points + points;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        points: newPoints,
        reliability_score: newReliabilityScore,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return profile;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  await storage.removeItem('token');
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error('No session found');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError) throw profileError;

  return {
    user: profile,
    token: session.access_token,
  };
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