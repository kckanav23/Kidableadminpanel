/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClientSummaryResponse = {
    id?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    status?: ClientSummaryResponse.status;
    therapies?: Array<'ABA' | 'Speech' | 'OT'>;
    photoUrl?: string;
};
export namespace ClientSummaryResponse {
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
        SUSPENDED = 'suspended',
    }
}

