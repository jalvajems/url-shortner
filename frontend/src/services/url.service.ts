import { api } from './api';
import { ApiResponse, UrlItem } from '../types';

export const urlService = {
  async shortenUrl(originalUrl: string): Promise<UrlItem> {
    const response = await api.post<ApiResponse<UrlItem>>('/api/urls', { originalUrl });
    return response.data.data;
  },

  async getUserUrls(): Promise<UrlItem[]> {
    const response = await api.get<ApiResponse<UrlItem[]>>('/api/urls');
    return response.data.data;
  },

  async deleteUrl(id: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/api/urls/${id}`);
    return response.data.success;
  },
};
