/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClientUpdateRequest = {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    age?: number;
    photoUrl?: string;
    therapyStartDate?: string;
    therapies?: Array<'ABA' | 'Speech' | 'OT'>;
    status?: ClientUpdateRequest.status;
    sensoryProfile?: Record<string, any>;
    preferences?: Array<string>;
    dislikes?: Array<string>;
    notes?: string;
    initialAssessment?: string;
};
export namespace ClientUpdateRequest {
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
        SUSPENDED = 'suspended',
    }
}

