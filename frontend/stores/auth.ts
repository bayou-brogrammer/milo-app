import { create } from 'zustand';
import { AuthState, AuthStore, AuthUser } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import * as SecureStore from 'expo-secure-store';

const INITIAL_STATE: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: {
    initial: true,
    login: false,
    signup: false,
    logout: false,
    profile: false,
    reset: false,
    refresh: false,
  },
  error: {
    login: null,
    signup: null,
    profile: null,
    reset: null,
    refresh: null,
  },
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...INITIAL_STATE,

  initialize: async () => {
    try {
      // Check for existing session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      console.log('session', session);

      if (session) {
        const { user } = session;

        // Fetch user profile if exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        set({
          isAuthenticated: true,
          user: { ...user, profile } as AuthUser,
          loading: { ...get().loading, initial: false },
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          loading: { ...get().loading, initial: false },
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        isAuthenticated: false,
        user: null,
        loading: { ...get().loading, initial: false },
      });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: { ...get().loading, login: true }, error: { ...get().error, login: null } });

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (session) {
        const { user } = session;

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        set({
          isAuthenticated: true,
          user: { ...user, profile } as AuthUser,
          loading: { ...get().loading, login: false },
        });

        await SecureStore.setItemAsync('supabase.auth.token', session.access_token);
      }
    } catch (error) {
      set({
        error: { ...get().error, login: error instanceof Error ? error.message : 'Login failed' },
        loading: { ...get().loading, login: false },
      });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: { ...get().loading, logout: true } });

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear secure storage
      await SecureStore.deleteItemAsync('supabase.auth.token');

      set({
        ...INITIAL_STATE,
        loading: { ...INITIAL_STATE.loading, initial: false, logout: false },
      });
    } catch (error) {
      set({ loading: { ...get().loading, logout: false } });
      throw error;
    }
  },

  signup: async (email: string, password: string, userData?: Partial<AuthUser['profile']>) => {
    set({ loading: { ...get().loading, signup: true }, error: { ...get().error, signup: null } });

    try {
      const { data: { session }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (session?.user && userData) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              ...userData,
            },
          ]);

        if (profileError) throw profileError;

        set({
          isAuthenticated: true,
          user: { ...session.user, profile: userData } as AuthUser,
          loading: { ...get().loading, signup: false },
        });
      }
    } catch (error) {
      set({
        error: { ...get().error, signup: error instanceof Error ? error.message : 'Signup failed' },
        loading: { ...get().loading, signup: false },
      });
      throw error;
    }
  },

  updateUserProfile: async (updates: Partial<AuthUser['profile']>) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    set({ loading: { ...get().loading, profile: true }, error: { ...get().error, profile: null } });

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      set({
        user: { ...user, profile: { ...user.profile, ...updates } },
        loading: { ...get().loading, profile: false },
      });
    } catch (error) {
      set({
        error: { ...get().error, profile: error instanceof Error ? error.message : 'Update failed' },
        loading: { ...get().loading, profile: false },
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: { ...get().loading, reset: true }, error: { ...get().error, reset: null } });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      set({ loading: { ...get().loading, reset: false } });
    } catch (error) {
      set({
        error: { ...get().error, reset: error instanceof Error ? error.message : 'Reset failed' },
        loading: { ...get().loading, reset: false },
      });
      throw error;
    }
  },

  refreshToken: async () => {
    set({ loading: { ...get().loading, refresh: true }, error: { ...get().error, refresh: null } });

    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (session) {
        const { user } = session;

        // Fetch updated profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        set({
          isAuthenticated: true,
          user: { ...user, profile } as AuthUser,
          loading: { ...get().loading, refresh: false },
        });
      }
    } catch (error) {
      set({
        error: { ...get().error, refresh: error instanceof Error ? error.message : 'Refresh failed' },
        loading: { ...get().loading, refresh: false },
      });
      throw error;
    }
  },
}));
