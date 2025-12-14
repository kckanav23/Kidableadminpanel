/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AdminAuditLogService } from './services/AdminAuditLogService';
import { AdminClientJournalService } from './services/AdminClientJournalService';
import { AdminClientMoodService } from './services/AdminClientMoodService';
import { AdminClientParentsService } from './services/AdminClientParentsService';
import { AdminClientProfileService } from './services/AdminClientProfileService';
import { AdminClientResourcesService } from './services/AdminClientResourcesService';
import { AdminClientsService } from './services/AdminClientsService';
import { AdminClientTherapistsService } from './services/AdminClientTherapistsService';
import { AdminGoalProgressService } from './services/AdminGoalProgressService';
import { AdminGoalsService } from './services/AdminGoalsService';
import { AdminHomeworkService } from './services/AdminHomeworkService';
import { AdminParentsService } from './services/AdminParentsService';
import { AdminResourceLibraryService } from './services/AdminResourceLibraryService';
import { AdminSessionActivitiesService } from './services/AdminSessionActivitiesService';
import { AdminSessionsService } from './services/AdminSessionsService';
import { AdminStaffAccessCodesService } from './services/AdminStaffAccessCodesService';
import { AdminStrategiesService } from './services/AdminStrategiesService';
import { AdminStrategyLibraryService } from './services/AdminStrategyLibraryService';
import { AdminTherapistsService } from './services/AdminTherapistsService';
import { AuthService } from './services/AuthService';
import { ClientService } from './services/ClientService';
import { GoalsService } from './services/GoalsService';
import { HealthControllerService } from './services/HealthControllerService';
import { HomeworkService } from './services/HomeworkService';
import { JournalService } from './services/JournalService';
import { MoodService } from './services/MoodService';
import { ResourcesService } from './services/ResourcesService';
import { SessionsService } from './services/SessionsService';
import { StaffAuthService } from './services/StaffAuthService';
import { StrategiesService } from './services/StrategiesService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
    public readonly adminAuditLog: AdminAuditLogService;
    public readonly adminClientJournal: AdminClientJournalService;
    public readonly adminClientMood: AdminClientMoodService;
    public readonly adminClientParents: AdminClientParentsService;
    public readonly adminClientProfile: AdminClientProfileService;
    public readonly adminClientResources: AdminClientResourcesService;
    public readonly adminClients: AdminClientsService;
    public readonly adminClientTherapists: AdminClientTherapistsService;
    public readonly adminGoalProgress: AdminGoalProgressService;
    public readonly adminGoals: AdminGoalsService;
    public readonly adminHomework: AdminHomeworkService;
    public readonly adminParents: AdminParentsService;
    public readonly adminResourceLibrary: AdminResourceLibraryService;
    public readonly adminSessionActivities: AdminSessionActivitiesService;
    public readonly adminSessions: AdminSessionsService;
    public readonly adminStaffAccessCodes: AdminStaffAccessCodesService;
    public readonly adminStrategies: AdminStrategiesService;
    public readonly adminStrategyLibrary: AdminStrategyLibraryService;
    public readonly adminTherapists: AdminTherapistsService;
    public readonly auth: AuthService;
    public readonly client: ClientService;
    public readonly goals: GoalsService;
    public readonly healthController: HealthControllerService;
    public readonly homework: HomeworkService;
    public readonly journal: JournalService;
    public readonly mood: MoodService;
    public readonly resources: ResourcesService;
    public readonly sessions: SessionsService;
    public readonly staffAuth: StaffAuthService;
    public readonly strategies: StrategiesService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'http://parent.kidable.in',
            VERSION: config?.VERSION ?? '0.0.1',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.adminAuditLog = new AdminAuditLogService(this.request);
        this.adminClientJournal = new AdminClientJournalService(this.request);
        this.adminClientMood = new AdminClientMoodService(this.request);
        this.adminClientParents = new AdminClientParentsService(this.request);
        this.adminClientProfile = new AdminClientProfileService(this.request);
        this.adminClientResources = new AdminClientResourcesService(this.request);
        this.adminClients = new AdminClientsService(this.request);
        this.adminClientTherapists = new AdminClientTherapistsService(this.request);
        this.adminGoalProgress = new AdminGoalProgressService(this.request);
        this.adminGoals = new AdminGoalsService(this.request);
        this.adminHomework = new AdminHomeworkService(this.request);
        this.adminParents = new AdminParentsService(this.request);
        this.adminResourceLibrary = new AdminResourceLibraryService(this.request);
        this.adminSessionActivities = new AdminSessionActivitiesService(this.request);
        this.adminSessions = new AdminSessionsService(this.request);
        this.adminStaffAccessCodes = new AdminStaffAccessCodesService(this.request);
        this.adminStrategies = new AdminStrategiesService(this.request);
        this.adminStrategyLibrary = new AdminStrategyLibraryService(this.request);
        this.adminTherapists = new AdminTherapistsService(this.request);
        this.auth = new AuthService(this.request);
        this.client = new ClientService(this.request);
        this.goals = new GoalsService(this.request);
        this.healthController = new HealthControllerService(this.request);
        this.homework = new HomeworkService(this.request);
        this.journal = new JournalService(this.request);
        this.mood = new MoodService(this.request);
        this.resources = new ResourcesService(this.request);
        this.sessions = new SessionsService(this.request);
        this.staffAuth = new StaffAuthService(this.request);
        this.strategies = new StrategiesService(this.request);
    }
}

