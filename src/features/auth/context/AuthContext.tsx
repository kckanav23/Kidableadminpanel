import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { clearAccessCode, getAccessCode, setAccessCode } from '@/lib/api';
import { getApiClient, refreshApiClient } from '@/lib/api/client';
import type { StaffLoginResponse } from '@/types/api';

export interface AuthContextValue {
  user: StaffLoginResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffLoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate any existing access code on mount
  useEffect(() => {
    const accessCode = getAccessCode();
    if (!accessCode) {
      setIsLoading(false);
      return;
    }

    const validateAccessCode = async () => {
      try {
        const api = getApiClient();
        const response = await api.staffAuth.login({
          requestBody: { accessCode },
        });
        setUser(response);
      } catch {
        clearAccessCode();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateAccessCode();
  }, []);

  const login = async (code: string) => {
    setIsLoading(true);
    try {
      const api = getApiClient();
      const response = await api.staffAuth.login({
        requestBody: { accessCode: code },
      });
      setUser(response);
      setAccessCode(code);
      refreshApiClient();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAccessCode();
    refreshApiClient();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}


