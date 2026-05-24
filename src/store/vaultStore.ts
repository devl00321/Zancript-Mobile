import { create } from 'zustand';

interface VaultState {
  isUploading: boolean;
  uploadProgress: number;
  uploadStage: 'pending' | 'encrypting' | 'sharding' | 'distributing' | 'verified';
  setUploadState: (state: Partial<VaultState>) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  isUploading: false,
  uploadProgress: 0,
  uploadStage: 'pending',
  setUploadState: (state) => set((prev) => ({ ...prev, ...state })),
}));
