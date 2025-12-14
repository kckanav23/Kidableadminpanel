/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientParentCreateRequest } from '../models/ClientParentCreateRequest';
import type { ClientParentResponse } from '../models/ClientParentResponse';
import type { ClientParentUpdateRequest } from '../models/ClientParentUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminClientParentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Update a parent and/or their relationship to the client
     * @returns ClientParentResponse OK
     * @throws ApiError
     */
    public update({
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
    public delete({
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
    public list5({
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
    public create4({
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
}
