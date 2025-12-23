import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient } from '@/lib/api/client';
import type {
  AuditLogResponse,
  ClientSummaryResponse,
  GoalResponse,
  HomeworkResponse,
  SessionResponse,
} from '@/types/api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  data: (role?: string, isAdmin?: boolean) => [...dashboardKeys.all, 'data', role ?? 'unknown', Boolean(isAdmin)] as const,
};

export type DashboardData = {
  clients: ClientSummaryResponse[];
  sessions: SessionResponse[];
  homework: HomeworkResponse[];
  goals: GoalResponse[];
  auditLogs: AuditLogResponse[];
};

export function useDashboardData({ role, isAdmin }: { role?: string; isAdmin?: boolean }) {
  return useQuery<DashboardData>({
    queryKey: dashboardKeys.data(role, isAdmin),
    queryFn: async () => {
      try {
        const api = getApiClient();

        const clientsData = await api.adminClients.listClients({
          size: 100,
          mine: role === 'THERAPIST',
        });
        const clients = clientsData.items || [];

        let auditLogs: AuditLogResponse[] = [];
        if (isAdmin) {
          try {
            const auditLogsData = await api.adminAuditLog.list7({ size: 5 });
            auditLogs = auditLogsData.items || [];
          } catch (error) {
            // Keep dashboard usable even if audit logs fail
            console.error('Error fetching audit logs:', error);
          }
        }

        let sessions: SessionResponse[] = [];
        let homework: HomeworkResponse[] = [];
        let goals: GoalResponse[] = [];

        if (clients.length > 0) {
          const clientIds = clients
            .slice(0, 10)
            .map((c) => c.id)
            .filter(Boolean) as string[];

          const [allSessions, allHomework, allGoals] = await Promise.all([
            Promise.all(clientIds.map((clientId) => api.adminSessions.getSessions({ clientId, limit: 5 }).catch(() => []))).then(
              (results) => results.flat()
            ),
            Promise.all(clientIds.map((clientId) => api.adminHomework.getHomework({ clientId, active: true }).catch(() => []))).then(
              (results) => results.flat()
            ),
            Promise.all(clientIds.map((clientId) => api.adminGoals.getGoals({ clientId, status: 'active' }).catch(() => []))).then(
              (results) => results.flat()
            ),
          ]);

          sessions = allSessions;
          homework = allHomework;
          goals = allGoals;
        }

        return { clients, sessions, homework, goals, auditLogs };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        throw error;
      }
    },
  });
}


