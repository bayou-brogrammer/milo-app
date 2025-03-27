import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  profile?: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: {
    initial: boolean;
    login: boolean;
    signup: boolean;
    logout: boolean;
    profile: boolean;
    reset: boolean;
    refresh: boolean;
  };
  error: {
    login: string | null;
    signup: string | null;
    profile: string | null;
    reset: string | null;
    refresh: string | null;
  };
}

export interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData?: Partial<AuthUser['profile']>) => Promise<void>;
  updateUserProfile: (updates: Partial<AuthUser['profile']>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  initialize: () => Promise<void>;
}