/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StaffAccessCodeCreateRequest } from '../models/StaffAccessCodeCreateRequest';
import type { StaffAccessCodeResponse } from '../models/StaffAccessCodeResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminStaffAccessCodesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List all staff access codes
     * Returns all staff access codes with optional filtering
     * @returns StaffAccessCodeResponse OK
     * @throws ApiError
     */
    public list2({
        active,
        userId,
    }: {
        active?: boolean,
        userId?: string,
    }): CancelablePromise<Array<StaffAccessCodeResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/staff-codes',
            query: {
                'active': active,
                'userId': userId,
            },
        });
    }
    /**
     * Create a new staff access code
     * Generates a new access code for the specified user
     * @returns StaffAccessCodeResponse Created
     * @throws ApiError
     */
    public create2({
        requestBody,
    }: {
        requestBody: StaffAccessCodeCreateRequest,
    }): CancelablePromise<StaffAccessCodeResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/staff-codes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get staff access code by ID
     * @returns StaffAccessCodeResponse OK
     * @throws ApiError
     */
    public get3({
        id,
    }: {
        id: string,
    }): CancelablePromise<StaffAccessCodeResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/staff-codes/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Revoke a staff access code
     * Deactivates the access code so it can no longer be used
     * @returns void
     * @throws ApiError
     */
    public revoke({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/staff-codes/{id}',
            path: {
                'id': id,
            },
        });
    }
}
