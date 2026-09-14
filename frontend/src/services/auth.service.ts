import { api } from './api';
import { AuthResponse } from '../types';

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },
};
