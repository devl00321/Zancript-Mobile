import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, InstrumentSerif_400Regular_Italic } from '@expo-google-fonts/instrument-serif';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true, // Native equivalent is AppState active listener which TanStack handles natively now
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Instrument Serif': InstrumentSerif_400Regular_Italic,
    'DM Sans': DMSans_400Regular,
    'JetBrains Mono': JetBrainsMono_400Regular,
    // Add additional weights as needed, mapping them explicitly
    // Since React Native maps font families by exact name, we can also use custom names
    DMSans_500Medium,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <View className="flex-1 bg-void">
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" />
        </View>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
