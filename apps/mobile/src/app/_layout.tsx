/**
 * Calendy Fit Mobile - Root Layout
 * Supabase-powered with React Query, navigation, and auth
 */

import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { View, StyleSheet } from 'react-native';

import { getSupabaseClient } from '@calendy/api';
import { config, initConfig } from '@calendy/config';

// Initialize config for mobile platform
initConfig('mobile');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30 * 1000, networkMode: 'offlineFirst' },
    mutations: { retry: 1, networkMode: 'offlineFirst' },
  },
});

const COLORS = {
  surface: { deep: '#000000' },
  text: { primary: '#EDEDEF' },
};

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Initialize Supabase
    const client = getSupabaseClient();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.surface.deep }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: COLORS.surface.deep },
            }}
          >
            <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="(trainer)" options={{ animation: 'slide_from_right' }} />
          </Stack>
          <Toast />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
