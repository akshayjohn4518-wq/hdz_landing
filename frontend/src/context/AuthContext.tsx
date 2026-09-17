import React, { useState, useEffect } from 'react';
import { AuthContext, type User, type SignupData } from './AuthContextDefinition';

const STORAGE_KEY = 'dayzero_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Invalid credentials. Access restricted to authorized operators.',
      };
    } catch (err: unknown) {
      console.error('Login network error:', err);
      return {
        success: false,
        error: 'Communication error with authentication backend.',
      };
    }
  };

  const signup = async (signupData: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Unable to register operator account.',
      };
    } catch (err: unknown) {
      console.error('Signup network error:', err);
      return {
        success: false,
        error: 'Communication error with registration service.',
      };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
