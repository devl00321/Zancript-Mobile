import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  derivedKey: string | null; // In-memory only!
  login: (user: User, token: string, derivedKey: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  derivedKey: null,
  login: async (user, token, derivedKey) => {
    await SecureStore.setItemAsync('jwt_token', token);
    set({ user, token, derivedKey });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('jwt_token');
    set({ user: null, token: null, derivedKey: null });
  },
}));
