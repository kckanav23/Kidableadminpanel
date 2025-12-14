/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionActivityResponse } from './SessionActivityResponse';
import type { TherapistSummary } from './TherapistSummary';
export type SessionResponse = {
    /**
     * Session id
     */
    id?: string;
    /**
     * Client id
     */
    clientId?: string;
    /**
     * Session number
     */
    sessionNumber?: number;
    /**
     * Session date
     */
    sessionDate?: string;
    /**
     * Therapy type
     */
    therapy?: SessionResponse.therapy;
    /**
     * Long-term objective
     */
    longTermObjective?: string;
    /**
     * Short-term objective
     */
    shortTermObjective?: string;
    /**
     * Zone
     */
    zone?: SessionResponse.zone;
    /**
     * Session tags
     */
    sessionTags?: Array<string>;
    /**
     * Success notes
     */
    successes?: Array<string>;
    /**
     * Struggle notes
     */
    struggles?: Array<string>;
    /**
     * Interventions used
     */
    interventionsUsed?: Array<string>;
    /**
     * Strategies used
     */
    strategiesUsed?: Array<string>;
    /**
     * Reinforcement types
     */
    reinforcementTypes?: Array<string>;
    /**
     * Data collection method
     */
    dataCollectionMethod?: string;
    /**
     * Discussion status
     */
    discussionStatus?: Array<string>;
    /**
     * Additional notes
     */
    additionalNotes?: string;
    /**
     * Created at
     */
    createdAt?: string;
    /**
     * Updated at
     */
    updatedAt?: string;
    therapist?: TherapistSummary;
    /**
     * Session activities (ABC)
     */
    sessionActivities?: Array<SessionActivityResponse>;
};
export namespace SessionResponse {
    /**
     * Therapy type
     */
    export enum therapy {
        ABA = 'ABA',
        SPEECH = 'Speech',
        OT = 'OT',
    }
    /**
     * Zone
     */
    export enum zone {
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        BLUE = 'blue',
    }
}

