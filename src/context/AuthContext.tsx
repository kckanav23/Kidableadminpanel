import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAccessCode, clearAccessCode, setAccessCode } from '../lib/api';
import { getApiClient, refreshApiClient } from '../lib/api-client';
import type { StaffLoginResponse } from '../types/api';

interface AuthContextType {
  user: StaffLoginResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffLoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing access code on mount and validate
  useEffect(() => {
    const accessCode = getAccessCode();
    if (accessCode) {
      // Validate the access code with the backend
      const validateAccessCode = async () => {
        try {
          const api = getApiClient();
          const response = await api.staffAuth.login({
            requestBody: { accessCode },
          });
          setUser(response);
        } catch (error) {
          // Invalid or expired access code, clear it
          clearAccessCode();
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };
      validateAccessCode();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (code: string) => {
    setIsLoading(true);
    try {
      const api = getApiClient();
      const response = await api.staffAuth.login({
        requestBody: { accessCode: code },
      });
      setUser(response);
      // Store access code on successful login
      setAccessCode(code);
      // Refresh API client with new auth headers
      refreshApiClient();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAccessCode();
    refreshApiClient(); // Refresh client after clearing auth
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
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
