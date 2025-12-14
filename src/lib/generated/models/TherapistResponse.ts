/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Therapist details
 */
export type TherapistResponse = {
    /**
     * Therapist ID
     */
    id?: string;
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
     * User role
     */
    role?: TherapistResponse.role;
    /**
     * Account status
     */
    status?: TherapistResponse.status;
    /**
     * Therapy specializations
     */
    specialization?: Array<'ABA' | 'Speech' | 'OT'>;
    /**
     * Avatar URL
     */
    avatarUrl?: string;
    /**
     * Account creation timestamp
     */
    createdAt?: string;
    /**
     * Last login timestamp
     */
    lastLogin?: string;
    /**
     * Generated access code (only returned on create)
     */
    accessCode?: string;
};
export namespace TherapistResponse {
    /**
     * User role
     */
    export enum role {
        ADMIN = 'admin',
        THERAPIST = 'therapist',
        PARENT = 'parent',
    }
    /**
     * Account status
     */
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
        SUSPENDED = 'suspended',
    }
}

