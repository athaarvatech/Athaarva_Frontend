"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api-service';

interface User {
  id: number;
  email: string;
  full_name: string;
  user_type: 'patient' | 'doctor' | 'hospital';
  is_verified: boolean;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  login: (token: string, userType: string, userId: number) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateOnboardingStatus: (completed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setUser(null);
        return;
      }

      // Get user data
      const userResponse = await apiService.getCurrentUser();
      
      setUser(userResponse.data);
      // Note: onboarding status could be part of user data or checked separately
      // setIsOnboardingCompleted(userResponse.data.is_onboarding_completed);

    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid, clear storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_id');
      setUser(null);
      setIsOnboardingCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string, userType: string, userId: number) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_type', userType);
    localStorage.setItem('user_id', userId.toString());
    apiService.setToken(token);
    
    // Set loading to true briefly to show transition
    setLoading(true);
    
    // Quick user data update instead of full checkAuth
    const userData: User = {
      id: userId,
      email: '', // Will be populated by checkAuth
      full_name: '',
      user_type: userType as 'patient' | 'doctor' | 'hospital',
      is_verified: true,
      is_active: true
    };
    setUser(userData);
    
    // Async fetch complete data without blocking
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    apiService.clearAuth();
    setUser(null);
    setIsOnboardingCompleted(false);
    router.push('/auth');
  };

  const updateOnboardingStatus = (completed: boolean) => {
    setIsOnboardingCompleted(completed);
  };

  // Optimize initial auth check
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        apiService.setToken(token);
        await checkAuth();
      } else {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isOnboardingCompleted,
    login,
    logout,
    checkAuth,
    updateOnboardingStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
