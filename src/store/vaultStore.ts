import { create } from 'zustand';
import { API, FileMetadata } from '../api/endpoints';

interface VaultState {
  isUploading: boolean;
  uploadProgress: number;
  uploadStage: 'pending' | 'encrypting' | 'sharding' | 'distributing' | 'verified';
  files: FileMetadata[];
  isLoading: boolean;
  error: string | null;
  fetchFiles: () => Promise<void>;
  setUploadState: (state: Partial<VaultState>) => void;
  addFile: (file: FileMetadata) => void;
  deleteFile: (id: string | number) => Promise<void>;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  isUploading: false,
  uploadProgress: 0,
  uploadStage: 'pending',
  files: [],
  isLoading: false,
  error: null,
  
  fetchFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const files = await API.files.list();
      set({ files, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch files', isLoading: false });
    }
  },
  
  setUploadState: (state) => set((prev) => ({ ...prev, ...state })),
  
  addFile: (file) => set((prev) => ({
    files: [file, ...prev.files],
  })),
  
  deleteFile: async (id) => {
    try {
      await API.files.delete(id);
      set((prev) => ({
        files: prev.files.filter(f => f.id !== id),
      }));
    } catch (error: any) {
      console.error('Failed to delete file', error);
    }
  }
}));
