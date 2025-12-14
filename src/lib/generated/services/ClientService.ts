/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientProfileResponse } from '../models/ClientProfileResponse';
import type { DashboardStatsResponse } from '../models/DashboardStatsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get client profile
     * Path params:
     * - clientId (uuid, required)
     * Returns client info + parents + support network + communication styles + initial goals.
     * @returns ClientProfileResponse OK
     * @throws ApiError
     */
    public getProfile({
        clientId,
    }: {
        clientId: string,
    }): CancelablePromise<ClientProfileResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/profile',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Get dashboard stats
     * Path params:
     * - clientId (uuid, required)
     * Returns summary counts and today's mood if present.
     * @returns DashboardStatsResponse OK
     * @throws ApiError
     */
    public getDashboard({
        clientId,
    }: {
        clientId: string,
    }): CancelablePromise<DashboardStatsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/dashboard',
            path: {
                'clientId': clientId,
            },
        });
    }
}
