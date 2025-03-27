import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';
import { useAuthStore } from '@/stores/auth';

export interface AuthError {
  message: string;
}

export async function signUp(email: string, password: string): Promise<AuthError | null> {
  try {
    await useAuthStore.getState().signup(email, password);
    return null;
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred during sign up',
    };
  }
}

export async function signIn(email: string, password: string): Promise<AuthError | null> {
  try {
    await useAuthStore.getState().login(email, password);
    return null;
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred during sign in',
    };
  }
}

export async function signOut(): Promise<void> {
  await useAuthStore.getState().logout();
}

export async function resetPassword(email: string): Promise<AuthError | null> {
  try {
    await useAuthStore.getState().resetPassword(email);
    return null;
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred during password reset',
    };
  }
}
