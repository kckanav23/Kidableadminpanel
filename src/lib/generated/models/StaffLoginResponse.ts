/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StaffLoginResponse = {
    /**
     * Login success
     */
    success?: boolean;
    /**
     * Staff user id
     */
    userId?: string;
    /**
     * Full name
     */
    fullName?: string;
    /**
     * User role
     */
    role?: StaffLoginResponse.role;
    /**
     * Is admin
     */
    admin?: boolean;
};
export namespace StaffLoginResponse {
    /**
     * User role
     */
    export enum role {
        ADMIN = 'admin',
        THERAPIST = 'therapist',
        PARENT = 'parent',
    }
}

