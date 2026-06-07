import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  initTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark', // Default
  initTheme: async () => {
    try {
      const stored = await AsyncStorage.getItem('zancrypt-theme');
      if (stored === 'light' || stored === 'dark') {
        set({ theme: stored });
      }
    } catch (e) {
      console.error('Failed to load theme', e);
    }
  },
  toggleTheme: async () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: newTheme });
    try {
      await AsyncStorage.setItem('zancrypt-theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  },
}));
