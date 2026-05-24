import { create } from 'zustand';
import { mockFiles, mockDecryptedNames } from '../api/mockData';

interface VaultState {
  isUploading: boolean;
  uploadProgress: number;
  uploadStage: 'pending' | 'encrypting' | 'sharding' | 'distributing' | 'verified';
  files: typeof mockFiles;
  decryptedNames: typeof mockDecryptedNames;
  setUploadState: (state: Partial<VaultState>) => void;
  addFile: (file: any, originalName: string) => void;
  deleteFile: (id: string) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  isUploading: false,
  uploadProgress: 0,
  uploadStage: 'pending',
  files: mockFiles,
  decryptedNames: mockDecryptedNames,
  setUploadState: (state) => set((prev) => ({ ...prev, ...state })),
  addFile: (file, originalName) => set((prev) => ({
    files: [file, ...prev.files],
    decryptedNames: {
      ...prev.decryptedNames,
      [file.encrypted_filename]: originalName,
    }
  })),
  deleteFile: (id) => set((prev) => ({
    files: prev.files.filter(f => f.id !== id),
  }))
}));
