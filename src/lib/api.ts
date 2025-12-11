// API service for KidAble backend
const API_BASE_URL = "https://parent.kidable.in/api";

// Storage key for access code
const ACCESS_CODE_KEY = "kidable_access_code";

// Get access code from storage
export function getAccessCode(): string | null {
  return localStorage.getItem(ACCESS_CODE_KEY);
}

// Set access code in storage
export function setAccessCode(code: string): void {
  localStorage.setItem(ACCESS_CODE_KEY, code);
}

// Clear access code from storage
export function clearAccessCode(): void {
  localStorage.removeItem(ACCESS_CODE_KEY);
}

// Helper function to get headers with access code
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const accessCode = getAccessCode();
  if (accessCode) {
    headers["X-Staff-Access-Code"] = accessCode;
  }

  return headers;
}

// Helper function to handle API responses
async function handleResponse<T>(
  response: Response,
): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));

    // If unauthorized, clear access code
    if (response.status === 401 || response.status === 403) {
      clearAccessCode();
    }

    throw new Error(
      error.message || `HTTP error! status: ${response.status}`,
    );
  }
  return response.json();
}

// Authentication API
export interface StaffLoginRequest {
  code: string;
}

export interface StaffLoginResponse {
  userId: string;
  userName: string;
  userEmail: string;
  admin: boolean;
  code: string;
}

export const authApi = {
  /**
   * Login with staff access code
   * @param code Access code
   */
  async login(accessCode: string): Promise<StaffLoginResponse> {
    const response = await fetch(
      `${API_BASE_URL}/staff/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode }),
      },
    );

    const data =
      await handleResponse<StaffLoginResponse>(response);

    // Store access code on successful login
    setAccessCode(accessCode);

    return data;
  },

  /**
   * Logout and clear access code
   */
  logout(): void {
    clearAccessCode();
  },
};

// Homework API
export interface HomeworkCompletionRequest {
  completionDate?: string; // ISO date string, defaults to today if null
  frequencyCount?: number;
  durationMinutes?: number;
  status:
    | "worked"
    | "not_worked"
    | "yet_to_try"
    | "not_started";
  notes?: string;
  loggedByParent?: string; // UUID
}

export interface HomeworkCompletionResponse {
  id: string;
  completionDate: string;
  frequencyCount?: number;
  durationMinutes?: number;
  status:
    | "worked"
    | "not_worked"
    | "yet_to_try"
    | "not_started";
  notes?: string;
  loggedByParent?: string;
}

export interface AssignedByUser {
  id: string;
  name: string;
  email: string;
}

export interface RelatedGoalResponse {
  id: string;
  title: string;
  description: string;
}

export interface HomeworkResponse {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  therapy: "ABA" | "Speech" | "OT";
  frequencyTarget?: string;
  assignedDate: string;
  dueDate?: string;
  status:
    | "worked"
    | "not_worked"
    | "yet_to_try"
    | "not_started";
  isActive: boolean;
  instructions?: string;
  videoUrl?: string;
  relatedGoalId?: string;
  assignedByUser?: AssignedByUser;
  homeworkCompletions?: HomeworkCompletionResponse[];
  relatedGoal?: RelatedGoalResponse;
}

export const homeworkApi = {
  /**
   * List homework assignments for a client
   * @param clientId Client UUID
   * @param active Filter for active homework only (default: true)
   */
  async listHomework(
    clientId: string,
    active: boolean = true,
  ): Promise<HomeworkResponse[]> {
    const response = await fetch(
      `${API_BASE_URL}/client/${clientId}/homework?active=${active}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );
    return handleResponse<HomeworkResponse[]>(response);
  },

  /**
   * Log homework completion
   * @param clientId Client UUID
   * @param homeworkId Homework UUID
   * @param data Completion data
   */
  async logCompletion(
    clientId: string,
    homeworkId: string,
    data: HomeworkCompletionRequest,
  ): Promise<HomeworkCompletionResponse> {
    const response = await fetch(
      `${API_BASE_URL}/client/${clientId}/homework/${homeworkId}/complete`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      },
    );
    return handleResponse<HomeworkCompletionResponse>(response);
  },
};

// Clients API
export interface ClientSummaryResponse {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  status: 'active' | 'inactive' | 'suspended';
  therapies: ('ABA' | 'Speech' | 'OT')[];
  photoUrl?: string;
}

export interface PageResponseClientSummaryResponse {
  items: ClientSummaryResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface ListClientsParams {
  status?: string;
  q?: string; // search query
  therapy?: string;
  page?: number;
  size?: number;
  mine?: boolean; // Only clients assigned to current therapist
}

export const clientsApi = {
  /**
   * List clients with filtering and pagination
   * @param params Query parameters for filtering and pagination
   */
  async listClients(params?: ListClientsParams): Promise<PageResponseClientSummaryResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.status) searchParams.append('status', params.status);
    if (params?.q) searchParams.append('q', params.q);
    if (params?.therapy) searchParams.append('therapy', params.therapy);
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.mine !== undefined) searchParams.append('mine', params.mine.toString());
    
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/admin/clients${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    return handleResponse<PageResponseClientSummaryResponse>(response);
  },
};

// Export API base URL for other services
export { API_BASE_URL };