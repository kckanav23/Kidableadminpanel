/**
 * API Client Wrapper
 * 
 * This file integrates the auto-generated API client with our authentication system.
 * All types and services are generated from the OpenAPI spec at /v3/api-docs
 * 
 * To regenerate after backend changes:
 *   npm run generate:api
 */

import { ApiClient } from './generated';
import { getAccessCode, clearAccessCode } from './api';

const API_BASE_URL = 'https://backend.kidable.in';

// Singleton API client instance
let apiClientInstance: ApiClient | null = null;

// Create a configured API client instance with current auth headers
function createApiClient(): ApiClient {
  const accessCode = getAccessCode();
  
  return new ApiClient({
    BASE: API_BASE_URL, // https://parent.kidable.in/api
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

// Get the API client instance (creates new one if needed or auth changed)
// Note: You may need to call refreshApiClient() after login/logout
export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = createApiClient();
  }
  return apiClientInstance;
}

// Refresh the API client (call after login/logout to update headers)
export function refreshApiClient(): ApiClient {
  apiClientInstance = createApiClient();
  return apiClientInstance;
}

// Re-export all generated types for convenience
export * from './generated';

// Re-export the ApiClient class
export { ApiClient };

// Helper to handle API errors and clear auth on 401/403
export async function handleApiError(error: any): Promise<never> {
  if (error?.status === 401 || error?.status === 403) {
    clearAccessCode();
    refreshApiClient(); // Refresh client after clearing auth
  }
  
  const message = error?.body?.message || error?.message || 'An error occurred';
  throw new Error(message);
}

