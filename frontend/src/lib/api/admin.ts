import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token refresh on 401
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('admin_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/admin/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token } = response.data;
          localStorage.setItem('admin_access_token', access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return adminApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
      email,
      password,
    });
    return response.data;
  },
  refresh: async (refreshToken: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/admin/refresh`, {
      refresh_token: refreshToken,
    });
    return response.data;
  },
  resetPassword: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/admin/reset`, {
      email,
    });
    return response.data;
  },
};

// Content API
export const contentApi = {
  list: async (params?: { page?: number; limit?: number; search?: string; type?: string; status?: string }) => {
    const response = await adminApi.get('/content', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await adminApi.get(`/content/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await adminApi.post('/content', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await adminApi.put(`/content/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await adminApi.delete(`/content/${id}`);
  },
};

// Users API
export const usersApi = {
  list: async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const response = await adminApi.get('/users', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await adminApi.get(`/users/${id}`);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await adminApi.patch(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await adminApi.delete(`/users/${id}`);
  },
};

// Seasons & Episodes API
export const seasonsApi = {
  create: async (data: { seriesId: string; number: number; title?: string }) => {
    const response = await adminApi.post('/seasons', data);
    return response.data;
  },
};

export const episodesApi = {
  create: async (data: { seasonId: string; title: string; number: number; description?: string; videoAssetId?: string }) => {
    const response = await adminApi.post('/episodes', data);
    return response.data;
  },
};

// Videos API
export const videosApi = {
  list: async (contentId?: string) => {
    const response = await adminApi.get('/videos', { params: { contentId } });
    return response.data;
  },
  get: async (id: string) => {
    const response = await adminApi.get(`/videos/${id}`);
    return response.data;
  },
  upload: async (file: File, contentId: string, quality: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentId', contentId);
    formData.append('quality', quality);
    const response = await adminApi.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  markTranscoded: async (assetId: string, data: { hlsUrl: string; duration: number }) => {
    const response = await adminApi.post(`/videos/${assetId}/mark-transcoded`, data);
    return response.data;
  },
};

// Images API
export const imagesApi = {
  upload: async (file: File, type: 'poster' | 'banner') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await adminApi.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  getDashboard: async () => {
    const response = await adminApi.get('/analytics/dashboard');
    return response.data;
  },
};

// Notifications API
export const notificationsApi = {
  list: async (params?: { page?: number; limit?: number; type?: string }) => {
    const response = await adminApi.get('/notifications', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await adminApi.get(`/notifications/${id}`);
    return response.data;
  },
  create: async (data: { title: string; message: string; type: 'push' | 'email'; userId?: string }) => {
    const response = await adminApi.post('/notifications', data);
    return response.data;
  },
};

export default adminApi;

