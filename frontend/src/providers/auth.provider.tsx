'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { User } from '@/types/user';
import { useRequest } from '@/hooks/use-request';

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
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/users/me', {
          withCredentials: true,
        });
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const { execute: getMe, errors: getMeErrors } = useRequest({
    url: '/api/users/me',
    method: 'get',
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const data = (await getMe()) as User;
        setUser(data);
      } catch (error) {
        console.error('Failed to load user: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const { execute: handleLogin, errors: loginErrors } = useRequest({
    url: '/api/users/login',
    method: 'post',
  });

  const login = async (email: string, password: string) => {
    const response = await handleLogin<User>({ email, password });

    if (response) {
      setUser(response as User);
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
    }
  };

  useEffect(() => {
    if (loginErrors || registerErrors || logoutErrors || getMeErrors) {
      setErrors(loginErrors || registerErrors || logoutErrors || getMeErrors);
    }
  }, [loginErrors, logoutErrors, registerErrors, getMeErrors]);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, errors }}
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
