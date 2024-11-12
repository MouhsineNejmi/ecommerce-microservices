/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { authApi } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.response?.data?.errors?.[0]?.message || 'Failed to login',
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register({ name, email, password });
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.response?.data?.errors?.[0]?.message || 'Failed to register',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.response?.data?.errors?.[0]?.message || 'Failed to logout',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
