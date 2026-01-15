/**
 * API Types
 * 
 * This file re-exports all API types from the generated OpenAPI client.
 * All types are automatically generated from the backend OpenAPI spec.
 * 
 * To regenerate types after backend changes:
 *   npm run generate:api
 */

// Re-export all generated types
export * from '../lib/generated';

// Re-export commonly used types with cleaner names
export type {
  // Client types
  ClientProfileResponse as ClientProfile,
  ClientSummaryResponse as ClientSummary,
  ClientCreateRequest as CreateClientRequest,
  ClientUpdateRequest as UpdateClientRequest,
  
  // Goal types
  GoalResponse as Goal,
  GoalCreateRequest as CreateGoalRequest,
  GoalUpdateRequest as UpdateGoalRequest,
  GoalProgressResponse as GoalProgress,
  GoalProgressCreateRequest as CreateGoalProgressRequest,
  
  // Homework types
  HomeworkResponse as Homework,
  HomeworkCreateRequest as CreateHomeworkRequest,
  HomeworkUpdateRequest as UpdateHomeworkRequest,
  HomeworkCompletionRequest as LogHomeworkCompletionRequest,
  HomeworkCompletionResponse as HomeworkCompletion,
  
  // Session types
  SessionResponse as Session,
  SessionCreateRequest as CreateSessionRequest,
  SessionUpdateRequest as UpdateSessionRequest,
  SessionActivityResponse as SessionActivity,
  SessionActivityCreateRequest as CreateSessionActivityRequest,
  
  // Strategy types
  StrategyResponse as Strategy,
  StrategyCreateRequest as CreateStrategyRequest,
  StrategyUpdateRequest as UpdateStrategyRequest,
  StrategyAssigntoClientRequest as StrategyAssignToClientRequest,
  
  // Resource types
  ResourceLibraryResponse as Resource,
  ResourceLibraryResponse as ResourceLibrary,
  ResourceCreateRequest as CreateResourceRequest,
  ResourceUpdateRequest as UpdateResourceRequest,
  ResourceAssignToClientRequest as ResourceAssignToClientRequest,
  
  // Therapist types
  TherapistResponse as Therapist,
  TherapistCreateRequest as CreateTherapistRequest,
  TherapistUpdateRequest as UpdateTherapistRequest,
  
  // Mood & Journal types
  MoodEntryRequest as CreateMoodEntryRequest,
  MoodEntryResponse as MoodEntry,
  JournalEntryRequest as CreateJournalEntryRequest,
  JournalEntryResponse as JournalEntry,
  
  // Auth types
  StaffLoginRequest,
  StaffLoginResponse,
  
  // Pagination types
  PageResponseClientSummaryResponse as ClientPageResponse,
  PageResponseTherapistResponse as TherapistPageResponse,
  PageResponseStrategyResponse as StrategyPageResponse,
  PageResponseResourceLibraryResponse as ResourcePageResponse,
  PageResponseParentResponse as ParentPageResponse,
  PageResponseAuditLogResponse as AuditLogPageResponse,
  
  // Other types
  DashboardStatsResponse,
  ParentResponse,
  ParentSummary,
  TherapistSummary,
  CommunicationStyleResponse,
  SupportNetworkResponse,
  InitialGoalResponse,
} from '../lib/generated';

