import { Listing } from './listings';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
  favorites?: string[];
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role?: UserRole;
}
