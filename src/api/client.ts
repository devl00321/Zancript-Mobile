import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://zancrypt.onrender.com';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const ANDROID_PACKAGE = process.env.EXPO_PUBLIC_ANDROID_PACKAGE;
const ANDROID_CERT = process.env.EXPO_PUBLIC_ANDROID_CERT;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (API_KEY && config.headers) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('X-API-Key', API_KEY);
      if (ANDROID_PACKAGE) config.headers.set('X-Android-Package', ANDROID_PACKAGE);
      if (ANDROID_CERT) config.headers.set('X-Android-Cert', ANDROID_CERT);
    } else {
      config.headers['X-API-Key'] = API_KEY;
      if (ANDROID_PACKAGE) config.headers['X-Android-Package'] = ANDROID_PACKAGE;
      if (ANDROID_CERT) config.headers['X-Android-Cert'] = ANDROID_CERT;
    }
  }
  return config;
});

// Optional: Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // We let individual components handle their own errors (e.g. catch block)
    // so it doesn't trigger the global Expo LogBox popup.
    return Promise.reject(error);
  }
);
