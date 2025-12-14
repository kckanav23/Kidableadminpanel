/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to update a therapist
 */
export type TherapistUpdateRequest = {
    /**
     * Full name
     */
    fullName?: string;
    /**
     * Email address
     */
    email?: string;
    /**
     * Phone number
     */
    phone?: string;
    /**
     * Account status
     */
    status?: TherapistUpdateRequest.status;
    /**
     * Therapy specializations
     */
    specialization?: Array<'ABA' | 'Speech' | 'OT'>;
    /**
     * Avatar URL
     */
    avatarUrl?: string;
};
export namespace TherapistUpdateRequest {
    /**
     * Account status
     */
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
        SUSPENDED = 'suspended',
    }
}

