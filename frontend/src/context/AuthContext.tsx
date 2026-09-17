import React, { useState, useEffect } from 'react';
import { AuthContext, type User } from './AuthContextDefinition';

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
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === 'admin' && cleanPass === 'dayzero') {
      const activeUser: User = {
        username: 'admin',
        name: 'Alex Vance',
        role: 'SUPER ADMIN',
        email: 'alex@dayzero.internal',
      };
      setUser(activeUser);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Access restricted to authorized operators.',
    };
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
