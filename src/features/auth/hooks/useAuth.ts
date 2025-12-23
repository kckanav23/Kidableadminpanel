import { useAuthContext } from '@/features/auth/context/AuthContext';

export function useAuth() {
  const auth = useAuthContext();

  const role = auth.user?.role;
  const isAdmin = Boolean(auth.user?.admin);

  return {
    ...auth,
    role,
    isAdmin,
  };
}


