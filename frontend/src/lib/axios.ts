import axios from 'axios';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://elevatex.dev/api';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/users/register`, credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/users/logout`);
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await axios.post(`${API_URL}/users/refresh-token`);
    return response.data;
  },
};
