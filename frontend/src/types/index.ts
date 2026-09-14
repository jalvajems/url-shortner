export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface UrlItem {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
