import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/stores/auth';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!loading.initial) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/sign-in');
      }
    }
  }, [isAuthenticated, loading.initial]);

  if (loading.initial) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: SpaceMono_400Regular,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
