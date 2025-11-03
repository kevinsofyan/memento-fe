import { apiClient } from '../client';
import { LoginInput, RegisterInput, AuthResponse } from '@/types/auth';

export const authService = {
  login: (data: LoginInput) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterInput) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  logout: () =>
    apiClient.post<void>('/auth/logout'),

  refreshToken: () =>
    apiClient.post<AuthResponse>('/auth/refresh'),
};

