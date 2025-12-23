/**
 * Central API + React Query configuration
 *
 * - Keeps a live `apiClient` binding that updates after login/logout (ESM live export).
 * - Exposes a singleton `queryClient` used by the app providers.
 */

import { QueryClient } from '@tanstack/react-query';
import { ApiClient } from '@/lib/generated';
import { clearAccessCode, getAccessCode } from '@/lib/api';

const API_BASE_URL = 'https://backend.kidable.in';
// const API_BASE_URL = 'http://localhost:40417';

function createApiClient(): ApiClient {
  const accessCode = getAccessCode();

  return new ApiClient({
    BASE: API_BASE_URL,
    HEADERS: accessCode
      ? {
          'X-Staff-Access-Code': accessCode,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        },
  });
}

/**
 * Singleton API client instance.
 *
 * Note: This is a `let` export intentionally. ESM exports are live bindings, so
 * after `refreshApiClient()` every importer observes the updated instance.
 */
export let apiClient: ApiClient = createApiClient();

export function getApiClient(): ApiClient {
  return apiClient;
}

export function refreshApiClient(): ApiClient {
  apiClient = createApiClient();
  return apiClient;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function isApiErrorLike(error: unknown): error is { status?: number; body?: { message?: string }; message?: string } {
  return typeof error === 'object' && error !== null;
}

// Helper to handle API errors and clear auth on 401/403
export async function handleApiError(error: unknown): Promise<never> {
  if (isApiErrorLike(error) && (error.status === 401 || error.status === 403)) {
    clearAccessCode();
    refreshApiClient();
  }

  const message =
    isApiErrorLike(error) ? error.body?.message || error.message || 'An error occurred' : 'An error occurred';
  throw new Error(message);
}

/**
 * Same 401/403 side effects as `handleApiError`, but never throws.
 * Useful inside react-query `onError` handlers where throwing can cause unhandled rejections.
 */
export function handleApiErrorSilently(error: unknown): void {
  if (isApiErrorLike(error) && (error.status === 401 || error.status === 403)) {
    clearAccessCode();
    refreshApiClient();
  }
}

// Re-export generated client/types for convenience (no modifications to generated code)
export * from '@/lib/generated';
export { ApiClient };


