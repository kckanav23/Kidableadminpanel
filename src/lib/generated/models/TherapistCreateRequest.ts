/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to create a therapist
 */
export type TherapistCreateRequest = {
    /**
     * Full name
     */
    fullName: string;
    /**
     * Email address
     */
    email?: string;
    /**
     * Phone number
     */
    phone?: string;
    /**
     * Account status (defaults to active)
     */
    status?: TherapistCreateRequest.status;
    /**
     * Therapy specializations
     */
    specialization?: Array<'ABA' | 'Speech' | 'OT'>;
    /**
     * Avatar URL
     */
    avatarUrl?: string;
    /**
     * Generate an access code for this therapist
     */
    generateAccessCode?: boolean;
    /**
     * Make the generated access code an admin code
     */
    isAdmin?: boolean;
};
export namespace TherapistCreateRequest {
    /**
     * Account status (defaults to active)
     */
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
        SUSPENDED = 'suspended',
    }
}

