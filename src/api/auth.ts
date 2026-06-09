import api from './client';

export const authApi = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  updateFcmToken: async (token: string) => {
    const response = await api.post('/auth/fcm-token', { token });
    return response.data;
  },
};
