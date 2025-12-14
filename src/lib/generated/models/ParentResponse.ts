/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Parent details
 */
export type ParentResponse = {
    /**
     * Parent ID
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
     * Account status
     */
    status?: ParentResponse.status;
    /**
     * Account creation timestamp
     */
    createdAt?: string;
};
export namespace ParentResponse {
    /**
     * Account status
     */
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
        SUSPENDED = 'suspended',
    }
}

