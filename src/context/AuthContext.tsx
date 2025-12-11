import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getAccessCode, StaffLoginResponse } from '../lib/api';

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

  // Check for existing access code on mount
  useEffect(() => {
    const accessCode = getAccessCode();
    if (accessCode) {
      // We have an access code, but we don't have user details
      // In a real app, you might want to validate the code with the backend
      // For now, we'll just set a minimal user object
      setUser({
        userId: '',
        userName: 'Staff Member',
        userEmail: '',
        admin: false,
        code: accessCode,
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(code);
      setUser(response);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
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
