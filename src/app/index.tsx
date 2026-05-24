import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { TOKENS } from '../constants/tokens';

export default function Index() {
  const router = useRouter();
  const token = useAuthStore(s => s.token);
  const initTheme = useThemeStore(s => s.initTheme);

  useEffect(() => {
    // Initialize theme from storage
    initTheme();

    // Check auth status
    // For now we just route to login if no token. Wait for layout mount.
    const timer = setTimeout(() => {
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [token, router, initTheme]);

  return (
    <View style={{ flex: 1, backgroundColor: TOKENS.colors.dark.void, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={TOKENS.colors.dark.acc} />
    </View>
  );
}
