import { apiClient } from './client';

export interface DashboardStats {
  total_storage_bytes: number;
  stored_files: number;
  active_nodes: number;
  security_score: number;
}

export interface FileMetadata {
  id: string | number;
  encrypted_filename: string;
  encrypted_metadata: string;
  file_size: number;
  created_at: string;
  is_deleted: boolean;
  folder_id?: number;
}

export const API = {
  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      const res = await apiClient.get('/api/dashboard/stats');
      return res.data;
    },
  },
  files: {
    list: async (folder_id?: number, all_files = false): Promise<FileMetadata[]> => {
      const params = new URLSearchParams();
      if (folder_id) params.append('folder_id', folder_id.toString());
      if (all_files) params.append('all_files', 'true');
      
      const res = await apiClient.get(`/files/list?${params.toString()}`);
      return res.data;
    },
    upload: async (formData: FormData): Promise<{ file_id: string }> => {
      // Axios has notorious bugs with FormData and file uploads in React Native (often hanging indefinitely without sending the request).
      // We use fetch directly here to ensure the boundary is set correctly by the JS engine.
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://zancrypt.onrender.com';
      const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
      
      const headers: Record<string, string> = {
        'X-API-Key': API_KEY || '',
      };
      
      if (process.env.EXPO_PUBLIC_ANDROID_PACKAGE) {
        headers['X-Android-Package'] = process.env.EXPO_PUBLIC_ANDROID_PACKAGE;
      }
      if (process.env.EXPO_PUBLIC_ANDROID_CERT) {
        headers['X-Android-Cert'] = process.env.EXPO_PUBLIC_ANDROID_CERT;
      }

      const res = await fetch(`${API_URL}/files/upload`, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (!res.ok) {
        let errMessage = 'Upload failed';
        try {
           const errData = await res.json();
           errMessage = errData.detail || errMessage;
        } catch(e) {}
        throw new Error(errMessage);
      }

      return await res.json();
    },
    delete: async (fileId: string | number): Promise<void> => {
      await apiClient.delete(`/files/${fileId}`);
    },
  },
  nodes: {
    list: async (): Promise<any[]> => {
      // Mocked if no nodes endpoint exists or assuming it's under nodes
      try {
         const res = await apiClient.get('/api/v1/nodes');
         return res.data;
      } catch (e) {
         return [];
      }
    }
  }
};
