import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { teamKeys } from '@/features/clients/tabs/team/hooks/teamKeys';

export type AddParentInput =
  | { mode: 'existing'; parentId: string; relationship: string; primary: boolean }
  | { mode: 'new'; fullName: string; email?: string; phone?: string; relationship: string; primary: boolean };

export type AddParentResult = { accessCode?: string };

export function useAddParent(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddParentInput): Promise<AddParentResult> => {
      const api = getApiClient();
      const response = await api.adminParents.createClientParent({
        clientId,
        requestBody:
          data.mode === 'existing'
            ? { parentId: data.parentId, relationship: data.relationship, primary: data.primary }
            : {
                fullName: data.fullName,
                email: data.email || undefined,
                phone: data.phone || undefined,
                relationship: data.relationship,
                primary: data.primary,
              },
      });

      if (data.mode === 'new' && response.parentId) {
        try {
          const code = await api.adminParentAccessCodes.create4({
            parentId: response.parentId,
            requestBody: { clientId },
          });
          return { accessCode: code.code || undefined };
        } catch {
          return {};
        }
      }

      return {};
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: teamKeys.parents(clientId) });
      if (result.accessCode) {
        toast.success(`Parent added! Access code copied: ${result.accessCode}`);
      } else {
        toast.success('Parent added successfully');
      }
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to add parent');
    },
  });
}


