/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientParentCreateRequest } from '../models/ClientParentCreateRequest';
import type { ClientParentResponse } from '../models/ClientParentResponse';
import type { ClientParentUpdateRequest } from '../models/ClientParentUpdateRequest';
import type { PageResponseParentResponse } from '../models/PageResponseParentResponse';
import type { ParentResponse } from '../models/ParentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminParentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Update a parent and/or their relationship to the client
     * @returns ClientParentResponse OK
     * @throws ApiError
     */
    public updateClientParent({
        clientId,
        parentId,
        requestBody,
    }: {
        clientId: string,
        parentId: string,
        requestBody: ClientParentUpdateRequest,
    }): CancelablePromise<ClientParentResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/admin/clients/{clientId}/parents/{parentId}',
            path: {
                'clientId': clientId,
                'parentId': parentId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Remove a parent from a client
     * @returns any OK
     * @throws ApiError
     */
    public deleteClientParent({
        clientId,
        parentId,
    }: {
        clientId: string,
        parentId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/parents/{parentId}',
            path: {
                'clientId': clientId,
                'parentId': parentId,
            },
        });
    }
    /**
     * List parents/caregivers linked to a client
     * @returns ClientParentResponse OK
     * @throws ApiError
     */
    public listClientParents({
        clientId,
    }: {
        clientId: string,
    }): CancelablePromise<Array<ClientParentResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/parents',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Add a parent to a client
     * If parentId is provided, links existing parent. Otherwise creates a new parent.
     * @returns ClientParentResponse OK
     * @throws ApiError
     */
    public createClientParent({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: ClientParentCreateRequest,
    }): CancelablePromise<ClientParentResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/parents',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List/search parents
     * Search parents by name, email, or phone
     * @returns PageResponseParentResponse OK
     * @throws ApiError
     */
    public list6({
        status,
        q,
        page,
        size = 20,
    }: {
        status?: string,
        q?: string,
        page?: number,
        size?: number,
    }): CancelablePromise<PageResponseParentResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/parents',
            query: {
                'status': status,
                'q': q,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * Get parent details
     * @returns ParentResponse OK
     * @throws ApiError
     */
    public get4({
        parentId,
    }: {
        parentId: string,
    }): CancelablePromise<ParentResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/parents/{parentId}',
            path: {
                'parentId': parentId,
            },
        });
    }
    /**
     * Delete parent
     * @returns void
     * @throws ApiError
     */
    public deleteParent({
        parentId,
    }: {
        parentId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/parents/{parentId}',
            path: {
                'parentId': parentId,
            },
        });
    }
}
