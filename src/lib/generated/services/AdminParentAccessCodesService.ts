/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ParentAccessCodeCreateRequest } from '../models/ParentAccessCodeCreateRequest';
import type { ParentAccessCodeResponse } from '../models/ParentAccessCodeResponse';
import type { ParentAccessCodeUpdateRequest } from '../models/ParentAccessCodeUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminParentAccessCodesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List access codes for a parent
     * @returns ParentAccessCodeResponse OK
     * @throws ApiError
     */
    public list4({
        parentId,
        clientId,
        active,
    }: {
        parentId: string,
        clientId?: string,
        active?: boolean,
    }): CancelablePromise<Array<ParentAccessCodeResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/parents/{parentId}/access-codes',
            path: {
                'parentId': parentId,
            },
            query: {
                'clientId': clientId,
                'active': active,
            },
        });
    }
    /**
     * Create a new access code for a parent
     * Generates a code when none is provided; validates uniqueness when provided.
     * @returns ParentAccessCodeResponse Created
     * @throws ApiError
     */
    public create4({
        parentId,
        requestBody,
    }: {
        parentId: string,
        requestBody: ParentAccessCodeCreateRequest,
    }): CancelablePromise<ParentAccessCodeResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/parents/{parentId}/access-codes',
            path: {
                'parentId': parentId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an access code
     * @returns void
     * @throws ApiError
     */
    public delete2({
        parentId,
        accessCodeId,
    }: {
        parentId: string,
        accessCodeId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/parents/{parentId}/access-codes/{accessCodeId}',
            path: {
                'parentId': parentId,
                'accessCodeId': accessCodeId,
            },
        });
    }
    /**
     * Update an access code
     * @returns ParentAccessCodeResponse OK
     * @throws ApiError
     */
    public update3({
        parentId,
        accessCodeId,
        requestBody,
    }: {
        parentId: string,
        accessCodeId: string,
        requestBody: ParentAccessCodeUpdateRequest,
    }): CancelablePromise<ParentAccessCodeResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/admin/parents/{parentId}/access-codes/{accessCodeId}',
            path: {
                'parentId': parentId,
                'accessCodeId': accessCodeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
