import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/features/auth/context/AuthContext';

export function useLogin() {
  const auth = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accessCode: string) => {
      await auth.login(accessCode);
    },
    onSuccess: async () => {
      // After login, refetch any server state that might depend on auth.
      await queryClient.invalidateQueries();
    },
  });
}


