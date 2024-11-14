/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useRequest } from '@/hooks/use-request';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  errors: React.ReactNode | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const { execute: handleLogin, errors: loginErrors } = useRequest({
    url: '/api/users/login',
    method: 'post',
  });

  const login = async (email: string, password: string) => {
    const response = await handleLogin<User>({ email, password });

    if (response) {
      setUser(response as User);
      localStorage.setItem('user', JSON.stringify(response));
    }
  };

  const { execute: handleRegister, errors: registerErrors } = useRequest({
    url: '/api/users/register',
    method: 'post',
  });

  const register = async (name: string, email: string, password: string) => {
    const response = await handleRegister<User>({ name, email, password });

    if (response) {
      setUser(response as User);
      localStorage.setItem('user', JSON.stringify(response));
    }
  };

  const { execute: handleLogout, errors: logoutErrors } = useRequest({
    url: '/api/users/logout',
    method: 'post',
  });

  const logout = async () => {
    const response = await handleLogout();
    if (response) {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    if (loginErrors || registerErrors || logoutErrors) {
      setErrors(loginErrors || registerErrors || logoutErrors);
    }
  }, [loginErrors, logoutErrors, registerErrors]);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
