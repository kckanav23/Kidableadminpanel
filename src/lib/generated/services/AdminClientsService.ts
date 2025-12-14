/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientCreateRequest } from '../models/ClientCreateRequest';
import type { ClientProfileResponse } from '../models/ClientProfileResponse';
import type { ClientUpdateRequest } from '../models/ClientUpdateRequest';
import type { PageResponseClientSummaryResponse } from '../models/PageResponseClientSummaryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminClientsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List clients
     * Filter by status, search term, or therapy type. Use mine=true to list only clients assigned to current therapist. Admins see all by default.
     * @returns PageResponseClientSummaryResponse OK
     * @throws ApiError
     */
    public listClients({
        status,
        q,
        therapy,
        page,
        size = 20,
        mine = false,
    }: {
        status?: string,
        q?: string,
        therapy?: string,
        page?: number,
        size?: number,
        mine?: boolean,
    }): CancelablePromise<PageResponseClientSummaryResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients',
            query: {
                'status': status,
                'q': q,
                'therapy': therapy,
                'page': page,
                'size': size,
                'mine': mine,
            },
        });
    }
    /**
     * Create client
     * @returns ClientProfileResponse OK
     * @throws ApiError
     */
    public createClient({
        requestBody,
    }: {
        requestBody: ClientCreateRequest,
    }): CancelablePromise<ClientProfileResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get client profile (admin)
     * @returns ClientProfileResponse OK
     * @throws ApiError
     */
    public getClient({
        clientId,
    }: {
        clientId: string,
    }): CancelablePromise<ClientProfileResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Soft delete client
     * @returns any OK
     * @throws ApiError
     */
    public deleteClient({
        clientId,
    }: {
        clientId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Update client (partial)
     * @returns ClientProfileResponse OK
     * @throws ApiError
     */
    public updateClient({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: ClientUpdateRequest,
    }): CancelablePromise<ClientProfileResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/admin/clients/{clientId}',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
