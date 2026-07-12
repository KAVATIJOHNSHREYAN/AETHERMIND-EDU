'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: string, email: string, rememberMe?: boolean) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const savedUserId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
    const savedEmail = localStorage.getItem('user_email') || sessionStorage.getItem('user_email');

    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUserId(savedUserId);
      setEmail(savedEmail);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUserId: string, newEmail: string, rememberMe = true) => {
    setToken(newToken);
    setUserId(newUserId);
    setEmail(newEmail);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_token', newToken);
    storage.setItem('user_id', newUserId);
    storage.setItem('user_email', newEmail);
    storage.setItem('aether_token', newToken);
    storage.setItem('aether_user', JSON.stringify({ email: newEmail, id: newUserId, subscription_status: 'free' }));
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setEmail(null);

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('aether_token');
    localStorage.removeItem('aether_user');

    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('aether_token');
    sessionStorage.removeItem('aether_user');
  };

  const value: AuthContextType = {
    token,
    userId,
    email,
    isAuthenticated: !!token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
