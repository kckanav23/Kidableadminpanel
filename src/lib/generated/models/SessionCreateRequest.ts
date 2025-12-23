/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionActivityCreateRequest } from './SessionActivityCreateRequest';
export type SessionCreateRequest = {
    sessionNumber: number;
    sessionDate: string;
    therapy: SessionCreateRequest.therapy;
    longTermObjective?: string;
    shortTermObjective?: string;
    zone?: SessionCreateRequest.zone;
    sessionActivities?: Array<SessionActivityCreateRequest>;
    sessionTags?: Array<string>;
    successes?: Array<string>;
    struggles?: Array<string>;
    interventionsUsed?: Array<string>;
    strategiesUsed?: Array<string>;
    reinforcementTypes?: Array<string>;
    discussionStatus?: Array<string>;
    additionalNotes?: string;
};
export namespace SessionCreateRequest {
    export enum therapy {
        ABA = 'ABA',
        SPEECH = 'Speech',
        OT = 'OT',
    }
    export enum zone {
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        BLUE = 'blue',
    }
}

