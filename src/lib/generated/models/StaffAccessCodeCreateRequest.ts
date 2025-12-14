/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to create a staff access code
 */
export type StaffAccessCodeCreateRequest = {
    /**
     * User ID to create code for
     */
    userId: string;
    /**
     * Whether this code grants admin privileges
     */
    admin?: boolean;
};

