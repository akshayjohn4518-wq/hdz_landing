import { createContext } from 'react';

export interface User {
  id?: string;
  username: string;
  name: string;
  role: string;
  email: string;
  last_login_at?: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
